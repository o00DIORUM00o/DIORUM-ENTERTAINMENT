export interface CraftingIngredient {
    id: string;
    quantity: number;
}

export interface CraftingRecipe {
    id: string;
    name: string;
    description: string;
    ingredients: CraftingIngredient[];
    result: {
        id: string;
        quantity: number;
    };
    requiredTalent?: {
        id: string;
        level: number;
    };
    requiredStation?: string;
    requiresLearning?: boolean;
}

class Registry {
    private recipes: Map<string, CraftingRecipe> = new Map();

    public register(recipe: CraftingRecipe) {
        this.recipes.set(recipe.id, recipe);
    }

    public get(id: string): CraftingRecipe | undefined {
        return this.recipes.get(id);
    }
    
    public getAll(): CraftingRecipe[] {
        return Array.from(this.recipes.values());
    }

    public getAllAsRecord(): Record<string, CraftingRecipe> {
        const record: Record<string, CraftingRecipe> = {};
        for (const [key, val] of this.recipes.entries()) {
            record[key] = val;
        }
        return record;
    }
}

export const RecipeRegistry = new Registry();

export function defineRecipes(recipes: CraftingRecipe[]) {
    for (const recipe of recipes) {
        RecipeRegistry.register(recipe);
    }
}
