// lib/api/gallery.ts
// This file mirrors the structure of product.ts, but is adapted for the gallery API.

// This interface mirrors the Mongoose model 'IGalleryItem' from src/models/gallery.model.ts
export interface IGallery {
  _id: string;
  category: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetches all gallery items.
 * Mirrors getAllProducts()
 * Backend route: GET /api/v1/gallery
 */
export const getAllGalleryItems = async (): Promise<IGallery[]> => {
  try {
    const response = await fetch('/api/v1/gallery');
    if (!response.ok) {
      throw new Error('Failed to fetch gallery items');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    throw error; // Re-throw to be handled by the component
  }
};

/**
 * Creates a new gallery item.
 * Mirrors createProduct(formData)
 * Expects FormData containing 'category' and 'image' (file).
 * Backend route: POST /api/v1/gallery
 */
export const createGalleryItem = async (formData: FormData): Promise<IGallery> => {
  try {
    const response = await fetch('/api/v1/gallery', {
      method: 'POST',
      body: formData,
      // 'Content-Type': 'multipart/form-data' is set by browser automatically for FormData
    });
    if (!response.ok) {
      throw new Error('Failed to create gallery item');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating gallery item:', error);
    throw error;
  }
};

/**
 * Updates an existing gallery item by its ID.
 * Mirrors updateProduct(id, formData)
 * Expects FormData containing optional 'category' and/or 'image' (file).
 * Backend route: PUT /api/v1/gallery/:id
 */
export const updateGalleryItem = async (id: string, formData: FormData): Promise<IGallery> => {
  try {
    const response = await fetch(`/api/v1/gallery/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to update gallery item');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating gallery item ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a gallery item by its ID.
 * Mirrors deleteProduct(id)
 * Backend route: DELETE /api/v1/gallery/:id
 */
export const deleteGalleryItem = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await fetch(`/api/v1/gallery/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete gallery item');
    }
    const data = await response.json();
    return data; // Backend returns { message: '...' }
  } catch (error) {
    console.error(`Error deleting gallery item ${id}:`, error);
    throw error;
  }
};