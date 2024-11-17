import { db, storage } from "@/firebase";
import { collection, query, doc, getDoc, where, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { IComments, ILikes, IRecipe, IRecipeData } from "@/interfaces";
import { getDownloadURL, ref } from "firebase/storage";

export const getRecipeData = async(recipeId: string) : Promise<IRecipeData | null> => {
    const recipe = await getRecipeById(recipeId);
    
    if (recipe) {
        const likes = await getLikesByRecipeId(recipeId);
        const comments = await getCommentsByRecipeId(recipeId);
        const image = await getRecipeImageById(recipe.imageId);

        return {
            recipe,
            likes,
            comments,
            image
        }
    }
    else {
        return null
    }
}

export const getRecipeById = async(recipeId: string) : Promise<IRecipe | null> => {
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

        return recipe;
    } else {
        console.log("No such document!");
        return null
    }
}

export const getRecipesListByCategory = async(category: string): Promise<IRecipe[]> => {
    let filteredQuery = query(collection(db, "recipes"));

        if(category) {
            filteredQuery = query(filteredQuery, where('category', '==', category));
        }

        try {
            const {docs} = await getDocs(filteredQuery);
    
            const recipes = docs.map((doc) => {
                const id = doc.id;
                const {label, ingredients, instruction, category, imageId} = doc.data();
                return {
                    id,
                    label,
                    ingredients,
                    instruction,
                    category,
                    imageId
                };
            })

            return recipes;
        } catch (error) {
            return [];
        }
}

export const getLikesByRecipeId = async(recipeId: string): Promise<ILikes[]> => {        
    const likesQuery =  query(collection(db, "likes"), where('recipeId', '==', recipeId));
    const {docs} = await getDocs(likesQuery);

    const likes = (docs.map((doc) => {
        const id = doc.id;
        return {
            id,
            userId: doc.data().userId,
            recipeId: doc.data().recipeId
        };
    }))

    return likes;
}

export const getCommentsByRecipeId = async(recipeId: string): Promise<IComments[]> => {        
    const commentsQuery =  query(collection(db, "comments"), where('recipeId', '==', recipeId));
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

    return comments;
}

export const setLikeToRecipe = async(recipeId: string, userId: string) => {    
    const newLike = await addDoc(collection(db, "likes"), {
        userId,
        recipeId
    });

    return newLike.id
}

export const deleteLikeFromRecipe = async(likeId: string) => {    
    await deleteDoc(doc(db, "likes", likeId));
}

export const setCommentToRecipe = async(recipeId: string, userId: string, userName: string, text: string) => {
    const newComment = await addDoc(collection(db, "comments"), {
        userId,
        recipeId,
        userName,
        text
    });
    
    return newComment.id
}

export const getRecipeImageById = async(imageId: number): Promise<string | null> => {
      try {
        const image = await getDownloadURL(ref(storage, `recipes-images/${imageId}.png`));
        return image;
      } catch (error) {
        return null;
      }
  };