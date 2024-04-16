"use client"

import React, { useEffect, useState } from "react";
import { useUser } from "@/store";
import { IComments, ILikes, IRecipes, IUser } from "@/interfaces";
import { db } from "@/firebase";
import { collection, query, doc, getDoc, setDoc, where, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { InferType, object, string } from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface IRecipeDetails {
    recipeId: string;
}

let fieldsSchema = object({
    text: string().required('text is required').min(3, 'Коментар занадто короткий')    
});

interface IFields extends InferType<typeof fieldsSchema>{};

const RecipeDetails: React.FC<IRecipeDetails> = ({recipeId}) => {
    const [recipe, setRecipe] = useState<IRecipes>();
    const [likes, setLikes] = useState<ILikes[]>([]);
    const [comments, setComments] = useState<IComments[]>([]);

    const loggedUser = useUser(state => state.loggedUser);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue,
        control
      } = useForm<IFields>({
        mode: 'onChange',
        resolver: yupResolver(fieldsSchema)
    });

    useEffect(() => {
        loadRecipe();
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
            setComments([...comments, {id: docRef.id, userId: loggedUser.id, userName: loggedUser.name, recipeId: recipeId, text: text}])
        }
    }

    const onSubmit: SubmitHandler<IFields> = (data) => {
        console.log(data);
        reset();
        setComment(data.text)
    }

    const LikedLabel: React.FC = () => {
        let likedLabel = <span> Щоб поставити лайк, увійдіть в систему </span>
        if(loggedUser) {
            const isLiked = likes.find(item => item.userId === loggedUser.id);

            likedLabel = isLiked ? <span>Вам сподобався цей рецепт <button type="button" onClick={onUnlike}> UNLIKE </button></span> : <button type="button" onClick={onLike}> LIKE </button>
        }
        return likedLabel;
    }

    const ingredientsList = recipe?.ingredients.map(item => {
        const index = recipe.ingredients.findIndex(ingredient => ingredient === item);

        return <li key={index}>{item}</li>
    })

    const instructionsList = recipe?.instruction.map(item => {
        const index = recipe.instruction.findIndex(instruction => instruction === item);

        return <li key={index}>{item}</li>
    })

    const CommentForm = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit)} className='shipping-form'>
            <div className='form-field-container'>
                <input
                {...register('text')}
                placeholder='Text'
                />
                {errors.text && <div className='error-message'>{errors.text.message}</div>}
            </div>

            <div className='button-container'>
                <button type='submit'>Submit</button>
            </div>        
        </form>
        )
    }

    const commentsList = comments.map(item => {
        const commentOwner = item.userId === loggedUser?.id ? "Ваш коментар" : item.userName
        return (
            <li key={item.id}>                
                <span>{commentOwner}:</span><br/>
                <span>{item.text}</span><br/>
                <br/>
            </li>
        )
    })
    
    return (
        <div className="recipe-details">                               
            <h1>{recipe?.label}</h1>
            <span>{likes.length} лайків <LikedLabel/> </span>
            <br/>
            <h2>Інгредієнти:</h2>
            <ul>{ingredientsList}</ul>
            <br/>
            <h2>Спосіб приготування:</h2>
            <ol>{instructionsList}</ol>
            <br/>
            <h2>Коментарі:</h2>
            {loggedUser ? <CommentForm/> : null}
            <ul>{commentsList}</ul>
        </div>      
    )    
}

export default RecipeDetails;