"use client"

import React, { useState } from "react";
import { useUser } from "@/store";
import { IComments, ILikes, IRecipeData } from "@/interfaces";
import { InferType, object, string } from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Avatar, Badge, Box, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Image from "next/image";
import recipeImagePlaceholder  from "@/images/recipeImagePlaceholder.png";
import { setLikeToRecipe, setCommentToRecipe, deleteLikeFromRecipe } from "@/services/firebase-service";

interface IRecipeDetailsContent {
    recipeData: IRecipeData;
}

let fieldsSchema = object({
    text: string().required('Ви маєте залишити коментар').min(3, 'Коментар занадто короткий')    
});

interface IFields extends InferType<typeof fieldsSchema>{};

const RecipeDetailsContent: React.FC<IRecipeDetailsContent> = ({recipeData}) => {
    const {recipe, likes, comments, image} = recipeData;

    const [localLikes, setLocalLikes] = useState<ILikes[]>(likes);
    const [localComments, setLocalComments] = useState<IComments[]>(comments);
    const [showAlert, setShowAlert] = useState<string>("none");

    const loggedUser = useUser(state => state.loggedUser);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
      } = useForm<IFields>({
        mode: 'onSubmit',
        resolver: yupResolver(fieldsSchema)
    });

    const onLike = async() => {
        if(loggedUser?.id) {
            const newLikeId = await setLikeToRecipe(recipe.id, loggedUser.id)
            setLocalLikes([...likes, {id: newLikeId, userId: loggedUser.id, recipeId: recipe.id}])
        }
    }

    const onUnlike = async() => {        
        if(loggedUser?.id) {
            const deletedLike = localLikes.find(item => item.userId === loggedUser.id && item.recipeId === recipe.id);
            if(deletedLike) {
                await deleteLikeFromRecipe(deletedLike.id)
                const index = likes.findIndex(item => item.id === deletedLike.id);
                const newLikes = [...likes.slice(0, index), ...likes.slice(index+1)];
                setLocalLikes(newLikes);
            }
        }
    }

    const setComment = async(text: string) => {
        if(loggedUser?.id && loggedUser?.name) {
            const newCommentId = await setCommentToRecipe(recipe.id, loggedUser.id, loggedUser.name, text)
            setLocalComments([...comments, {id: newCommentId, userId: loggedUser.id, userName: loggedUser.name, userAvatar: loggedUser.photoURL, recipeId: recipe.id, text: text}])
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
        const isLiked = localLikes.find(item => item.userId === loggedUser?.id);
        const clickFunction = loggedUser ? isLiked ? () => onUnlike() : () => onLike() : () => onShowAlert();
        const icon = isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon/>

        return (
            <IconButton
                size="large"
                color="inherit"
                onClick={clickFunction}
            >
                <Badge badgeContent={localLikes.length} color="error">
                    {icon}
                </Badge>
            </IconButton>
        )
    }

    const ingredientsList = recipe.ingredients.map(item => {
        const index = recipe.ingredients.findIndex(ingredient => ingredient === item);

        return (
            <ListItem key={index}>
                <ListItemText
                primary={item}
                />
            </ListItem>
        )
    })

    const instructionsList = recipe.instruction.map(item => {
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

    const commentsList = localComments.map(item => {
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
            src={image ? image : recipeImagePlaceholder}
            alt={recipe ? recipe.label : "recipe"}
            width={750}
            height={500}
            style={{borderRadius: "3%", margin: "auto"}}
            priority
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