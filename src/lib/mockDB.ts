
// Mock database implementation using localStorage for frontend-only development
// In a real application, these operations would be performed on a backend server

/**
 * Generic storage helper with type safety
 */
export class MockStorage<T> {
  constructor(private storageKey: string) {
    // Initialize storage if empty
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify([]));
    }
  }

  // Get all items
  getAll(): T[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Get item by id
  getById(id: string): T | null {
    const items = this.getAll();
    // @ts-ignore - We're assuming T has an id property
    const item = items.find(item => item.id === id);
    return item || null;
  }

  // Add new item
  add(item: T): T {
    const items = this.getAll();
    items.push(item);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    return item;
  }

  // Update item
  update(id: string, updatedItem: Partial<T>): T | null {
    const items = this.getAll();
    // @ts-ignore - We're assuming T has an id property
    const index = items.findIndex(item => item.id === id);
    
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedItem };
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      return items[index];
    }
    
    return null;
  }

  // Delete item
  delete(id: string): boolean {
    const items = this.getAll();
    // @ts-ignore - We're assuming T has an id property
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length !== items.length) {
      localStorage.setItem(this.storageKey, JSON.stringify(filteredItems));
      return true;
    }
    
    return false;
  }
}

// Helper to simulate network delay
export const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));
