"use client"

import React, { useEffect, useState } from "react";
import { useUser } from "@/store";
import { IComments, ILikes, IRecipes } from "@/interfaces";
import { db, storage } from "@/firebase";
import { collection, query, doc, getDoc, where, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { InferType, object, string } from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Avatar, Badge, BottomNavigationAction, Box, Button, CardMedia, Container, IconButton, List, ListItem, ListItemAvatar, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { getDownloadURL, ref } from "firebase/storage";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Image from "next/image";
import recipeImagePlaceholder from "@/images";

interface IRecipeDetails {
    recipeId: string;
}

let fieldsSchema = object({
    text: string().required('Ви маєте залишити коментар').min(3, 'Коментар занадто короткий')    
});

interface IFields extends InferType<typeof fieldsSchema>{};

const RecipeDetailsContent: React.FC<IRecipeDetails> = ({recipeId}) => {
    const [recipe, setRecipe] = useState<IRecipes>();
    const [likes, setLikes] = useState<ILikes[]>([]);
    const [comments, setComments] = useState<IComments[]>([]);
    const [image, setImage] = useState<string|null>(null);
    const [showAlert, setShowAlert] = useState<string>("none");

    const loggedUser = useUser(state => state.loggedUser);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue,
        control
      } = useForm<IFields>({
        mode: 'onSubmit',
        resolver: yupResolver(fieldsSchema)
    });

    useEffect(() => {
        loadRecipe();
        getImage();
        loadLikes();
        loadComments();
    }, [])

    const loadRecipe = async() => {
        const docRef = doc(db, "recipes", recipeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const recipe = {
                id: recipeId,
                label: docSnap.data().label,
                ingredients: docSnap.data().ingredients,
                instruction: docSnap.data().instruction,
                category: docSnap.data().category,
                imageId: docSnap.data().imageId
            }

            setRecipe(recipe);
        } else {
            console.log("No such document!");
        }
    }

    const getImage = async() => {
        try {
          const url = await getDownloadURL(ref(storage, `recipes-images/${recipe?.imageId}.png`));
          setImage(url);
        } catch (error) {
          setImage(recipeImagePlaceholder.src);
        }
      };

    const loadLikes = async() => {        
        const likesQuery =  query(collection(db, "likes"), where('recipeId', '==', recipeId));

        try {
            const {docs} = await getDocs(likesQuery);
    
            const likes = (docs.map((doc) => {
                const id = doc.id;
                return {
                    id,
                    userId: doc.data().userId,
                    recipeId: doc.data().recipeId
                };
            }))
            setLikes(likes);
        } catch (error) {
            console.error(error);
        }
    }

    const loadComments = async() => {        
        const commentsQuery =  query(collection(db, "comments"), where('recipeId', '==', recipeId));

        try {
            const {docs} = await getDocs(commentsQuery);
    
            const comments = (docs.map((doc) => {
                const id = doc.id;
                return {
                    id,
                    recipeId: doc.data().recipeId,
                    userId: doc.data().userId,
                    userName: doc.data().userName,
                    userAvatar: doc.data().userAvatar,
                    text: doc.data().text
                };
            }))
            setComments(comments);
        } catch (error) {
            console.error(error);
        }
    }

    const onLike = async() => {
        if(loggedUser?.id) {
            const docRef = await addDoc(collection(db, "likes"), {
                userId: loggedUser.id,
                recipeId: recipeId
            });
            setLikes([...likes, {id: docRef.id, userId: loggedUser.id, recipeId: recipeId}])
        }
    }

    const onUnlike = async() => {        
        if(loggedUser?.id) {
            const deletedLike = likes.find(item => item.userId === loggedUser.id && item.recipeId === recipeId);
            if(deletedLike) {
                await deleteDoc(doc(db, "likes", deletedLike.id));
                const index = likes.findIndex(item => item.id === deletedLike.id);
                const newLikes = [...likes.slice(0, index), ...likes.slice(index+1)];
                setLikes(newLikes);
            }
        }
    }

    const setComment = async(text: string) => {
        if(loggedUser?.id && loggedUser?.name) {
            const docRef = await addDoc(collection(db, "comments"), {
                userId: loggedUser.id,
                recipeId: recipeId,
                userName: loggedUser.name,
                text: text
            });
            setComments([...comments, {id: docRef.id, userId: loggedUser.id, userName: loggedUser.name, userAvatar: loggedUser.photoURL, recipeId: recipeId, text: text}])
        }
    }

    const onSubmit: SubmitHandler<IFields> = (data) => {
        console.log(data);
        reset();
        setComment(data.text)
    }

    const onShowAlert = () => {
        setShowAlert("flex")
    }
    
    const LikeButton: React.FC = () => {
        const isLiked = likes.find(item => item.userId === loggedUser?.id);
        const clickFunction = loggedUser ? isLiked ? () => onUnlike() : () => onLike() : () => onShowAlert();
        const icon = isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon/>

        return (
            <IconButton
                size="large"
                color="inherit"
                onClick={clickFunction}
            >
                <Badge badgeContent={likes.length} color="error">
                    {icon}
                </Badge>
            </IconButton>
        )
    }

    const ingredientsList = recipe?.ingredients.map(item => {
        const index = recipe.ingredients.findIndex(ingredient => ingredient === item);

        return (
            <ListItem key={index}>
                <ListItemText
                primary={item}
                />
            </ListItem>
        )
    })

    const instructionsList = recipe?.instruction.map(item => {
        const index = recipe.instruction.findIndex(instruction => instruction === item);

        return (
            <ListItem key={index}>
                <ListItemText
                primary={item}
                />
            </ListItem>
        )
    })

    const CommentForm: React.FC = () => {
        if (loggedUser) {        
            return (
                <form onSubmit={handleSubmit(onSubmit)} className='shipping-form'>
                    <TextField
                        {...register('text')}
                        error={errors.text ? true : false}
                        id="outlined-required"
                        label="Коментар"
                        helperText={errors.text ? errors.text.message : null}
                        fullWidth
                        sx={{mb: 1}}
                    />
                    <Button 
                        variant="outlined"
                        color="success"
                        type="submit"
                        fullWidth
                    >
                        Коментувати
                    </Button>
                </form>
            )
        }
        else {
            return (
                <Alert severity="warning">
                    Щоб залишити коментар, увійдіть в систему.
                </Alert>
            )
        }
    }

    const commentsList = comments.map(item => {
        const commentOwner = item.userId === loggedUser?.id ? "Ваш коментар" : item.userName
        return (
            <ListItem alignItems="flex-start" key={item.id}>
                <ListItemAvatar>
                    <Avatar alt={commentOwner} src={item.userAvatar ? item.userAvatar : "#"} />
                </ListItemAvatar>
                <ListItemText
                    primary={commentOwner}
                    secondary={
                        <React.Fragment>
                            {item.text}
                        </React.Fragment>
                    }
                />
            </ListItem>
        )
    })

    const likeAlertProp = loggedUser ? "none" : showAlert
    
    return (
        <React.Fragment>
            <Image 
            src={image ? image : "/#"}
            alt={recipe ? recipe.label : "recipe"}
            width={750}
            height={500}
            style={{borderRadius: "3%"}}
            />
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", mt: 2 }}>
                <Typography
                    variant="h4"
                    component="div"
                >
                    {recipe?.label}
                </Typography>
                <LikeButton/>
            </Box>
            <Alert severity="warning" sx={{display: likeAlertProp}}>
                Щоб поставити лайк, увійдіть в систему.
            </Alert>
            <Typography variant="h6" component="div">
                Інгредієнти:
            </Typography>
            <List disablePadding={true}>
                {ingredientsList}
            </List>
            <Typography variant="h6" component="div">
                Спосіб приготування:
            </Typography>
            <List>
                {instructionsList}
            </List>
            <CommentForm/>
            <Typography variant="h6" component="div">
                Коментарі:
            </Typography>
            <ul>{commentsList}</ul>
        </React.Fragment>      
    )    
}

export default RecipeDetailsContent;