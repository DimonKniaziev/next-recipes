import React from "react";

interface IRecipesListItem {
    label: string,
    imageId: number
}

const RecipesListItem: React.FC<IRecipesListItem> = ({label, imageId}) => {
    return (        
        <div className="recipes-list-item">
            <div className="recipes-list-item-image-container">
                <span>{imageId}</span>
            </div>
            <div className="recipes-list-item-label-container">
                <span className="recipes-list-item-name">{label}</span>
            </div>
        </div>
    )
}

export default RecipesListItem;