// Quick fix for AdminPanel database operations
// Add this to your handleDeleteProperty function:

const handleDeleteProperty = async (id: string) => {
  if (confirm('Are you sure you want to delete this property?')) {
    try {
      const success = await propertyAPI.delete(id);
      if (success) {
        // Refresh properties from database
        await refreshProperties();
        console.log('Property deleted successfully');
      } else {
        alert('Failed to delete property. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Error deleting property. Please try again.');
    }
  }
};

// For creating properties, add this after successful creation:
if (result) {
  // Refresh properties from database instead of manual state update
  await refreshProperties();
  console.log('Property created successfully');
}