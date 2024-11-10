"use client"

import React from "react";
import { useRouter } from 'next/navigation'
import { Modal, Container} from "@mui/material";
import RecipeDetailsContent from "./recipe-details-content";

interface IRecipeDetails {
    recipeId: string;
}

const RecipeDetailsModal: React.FC<IRecipeDetails> = ({recipeId}) => {   
    const router = useRouter()
    const handleCloseModal = () => {
        router.back()
    }
    
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
                <RecipeDetailsContent recipeId={recipeId}/>
            </Container>
        </Modal>    
    )    
}

export default RecipeDetailsModal;