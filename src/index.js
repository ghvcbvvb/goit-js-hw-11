import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const gallery = document.querySelector('.gallery');
    const loadMoreButton = document.querySelector('.load-more');
  
    let page = 1;
    let query = '';
    const perPage = 40;
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      query = form.searchQuery.value.trim();
      page = 1;
  
      if (query === '') return Notiflix.Notify.failure('Please enter a search term.');
  
      gallery.innerHTML = '';
      loadMoreButton.style.display = 'none';
  
      try {
        const data = await fetchImages(query, page, perPage);
        renderGallery(data.hits);
  
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        if (data.hits.length < perPage || data.hits.length === data.totalHits) {
          loadMoreButton.style.display = 'none';
        } else {
          loadMoreButton.style.display = 'block';
        }
      } catch (error) {
        Notiflix.Notify.failure('Something went wrong. Please try again later.');
      }
    });
  
    loadMoreButton.addEventListener('click', async () => {
      page++;
      try {
        const data = await fetchImages(query, page, perPage);
        renderGallery(data.hits);
  
        if (page * perPage >= data.totalHits) {
          loadMoreButton.style.display = 'none';
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
      } catch (error) {
        Notiflix.Notify.failure('Something went wrong. Please try again later.');
      }
    });
  
    async function fetchImages(query, page, perPage) {
      const apiKey = '45743508-0ccb11df289254256ada244c4';
      const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    }
  
    function renderGallery(images) {
      const markup = images.map(image => `
        <div class="photo-card">
          <a href="${image.largeImageURL}" class="lightbox">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item"><b>Likes</b> ${image.likes}</p>
            <p class="info-item"><b>Views</b> ${image.views}</p>
            <p class="info-item"><b>Comments</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
          </div>
        </div>
      `).join('');
  
      gallery.insertAdjacentHTML('beforeend', markup);
  
      new SimpleLightbox('.gallery a').refresh();
  
      const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  });
  