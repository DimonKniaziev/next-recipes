"use client"

import React from "react";
import { useRouter } from 'next/navigation'
import { Modal, Container} from "@mui/material";
import RecipeDetailsContent from "./recipe-details-content";
import { IRecipeData } from "@/interfaces";

interface IRecipeDetailsModal {
    recipeData: IRecipeData | null;
}

const RecipeDetailsModal: React.FC<IRecipeDetailsModal> = ({recipeData}) => {
    const router = useRouter()
    const handleCloseModal = () => {
        router.back()
    }

    const content = recipeData ? <RecipeDetailsContent recipeData={recipeData}/> : <span>РЕЦЕПТ НЕ ЗНАЙДЕНО</span>
    
    return (
        <Modal
                open={true}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{margin: 10}}
            >
            <Container 
                maxWidth="md"
                sx={{ 
                    alignContent: "center",
                    backgroundColor: "white",
                    borderRadius: "20px",
                    paddingTop: 3,
                    overflow: "scroll",
                    overflowX: "hidden",
                    height: "100%"
                    }}
                
                >
                {content}
            </Container>
        </Modal>    
    )    
}

export default RecipeDetailsModal;