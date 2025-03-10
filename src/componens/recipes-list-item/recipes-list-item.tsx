import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";
import recipeImagePlaceholder from "@/images/recipeImagePlaceholder.png";
import { getRecipeImageById } from "@/services/firebase-service";

interface IRecipesListItem {
    label: string,
    imageId: number
}

const RecipesListItem: React.FC<IRecipesListItem> = async ({label, imageId}) => {
  const image = await getRecipeImageById(imageId);

  return (
    <Card
     sx={{ border: 0, boxShadow: 0}}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          sx={{ borderRadius: "3%" }}
          image = { image ? image : recipeImagePlaceholder.src }
          title={label}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {label}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default RecipesListItem;