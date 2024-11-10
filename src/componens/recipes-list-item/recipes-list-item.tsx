import { storage } from "@/firebase";
import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import recipeImagePlaceholder from "@/images";

interface IRecipesListItem {
    label: string,
    imageId: number
}

const RecipesListItem: React.FC<IRecipesListItem> = ({label, imageId}) => {
  const [image, setImage] = useState<string>();
  useEffect(() => {
    getImage();
  })

  const getImage = async() => {
    try {
      const url = await getDownloadURL(ref(storage, `recipes-images/${imageId}.png`));
      setImage(url);
    } catch (error) {
      setImage(recipeImagePlaceholder.src);
    }
  };

  return (
    <Card
     sx={{ border: 0, boxShadow: 0}}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          sx={{ borderRadius: "3%" }}
          image = { image }
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