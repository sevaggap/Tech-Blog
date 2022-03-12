const commentHandler = async (event) => {
    event.preventDefault();
  
    const content = document.querySelector('.comment').value.trim();
    const id = event.target.getAttribute('data-id');

    if (content) {
      const response = await fetch('/api/comments/add', {
        method: 'POST',
        body: JSON.stringify({ content, id }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace(`/post/${id}`);
      } else {
        alert(response.statusText);
      }
    }
};
  
document
    .querySelector('.comment-form')
    .addEventListener('click', commentHandler);

  