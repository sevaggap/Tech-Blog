const delButtonHandler = async (event) => {
  event.preventDefault();

  if (event.target.hasAttribute('data-id')) {
      const id = event.target.getAttribute('data-id');
  
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert('Failed to delete post');
      }
    }
  };
  
  const updateButtonHandler = async (event) => {
  event.preventDefault();

  if (event.target.hasAttribute('data-id')) {
      const id = event.target.getAttribute('data-id');

      const title = document.querySelector('.post-title').value.trim();
      const content = document.querySelector('.post-content').value.trim();
      
    if(title && content) {
      const response = await fetch(`/api/posts/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert('Failed to update post');
      }
    }
    }
  };

  document
  .querySelector('.update-form')
  .addEventListener('click', updateButtonHandler);

  document
  .querySelector('.delete-form')
  .addEventListener('click', delButtonHandler);