
$(document).ready(function () {
	"use strict"; // start of use strict

	/*==============================
	Menu
	==============================*/
	$('.header__btn').on('click', function () {
		$(this).toggleClass('header__btn--active');
		$('.header__nav').toggleClass('header__nav--active');
		$('.body').toggleClass('body--active');

		if ($('.header__search-btn').hasClass('active')) {
			$('.header__search-btn').toggleClass('active');
			$('.header__search').toggleClass('header__search--active');
		}
	});

	/*==============================
	Search
	==============================*/
	$('.header__search-btn').on('click', function () {
		$(this).toggleClass('active');
		$('.header__search').toggleClass('header__search--active');

		if ($('.header__btn').hasClass('header__btn--active')) {
			$('.header__btn').toggleClass('header__btn--active');
			$('.header__nav').toggleClass('header__nav--active');
			$('.body').toggleClass('body--active');
		}
	});

	/*==============================
	Home
	==============================*/
	$('.home__bg').owlCarousel({
		animateOut: 'fadeOut',
		animateIn: 'fadeIn',
		mouseDrag: false,
		touchDrag: false,
		items: 1,
		dots: false,
		loop: true,
		autoplay: false,
		smartSpeed: 600,
		margin: 0,
	});

	$('.home__bg .item').each(function () {
		if ($(this).attr("data-bg")) {
			$(this).css({
				'background': 'url(' + $(this).data('bg') + ')',
				'background-position': 'center center',
				'background-repeat': 'no-repeat',
				'background-size': 'cover'
			});
		}
	});

	$('.home__carousel').owlCarousel({
		mouseDrag: false,
		touchDrag: false,
		dots: false,
		loop: true,
		autoplay: false,
		smartSpeed: 600,
		margin: 30,
		responsive: {
			0: {
				items: 2,
			},
			576: {
				items: 2,
			},
			768: {
				items: 3,
			},
			992: {
				items: 4,
			},
			1200: {
				items: 4,
			},
		}
	});

	$('.home__nav--next').on('click', function () {
		$('.home__carousel, .home__bg').trigger('next.owl.carousel');
	});
	$('.home__nav--prev').on('click', function () {
		$('.home__carousel, .home__bg').trigger('prev.owl.carousel');
	});

	$(window).on('resize', function () {
		var itemHeight = $('.home__bg').height();
		$('.home__bg .item').css("height", itemHeight + "px");
	});
	$(window).trigger('resize');

	/*==============================
	Tabs
	==============================*/
	$('.content__mobile-tabs-menu li').each(function () {
		$(this).attr('data-value', $(this).text().toLowerCase());
	});

	$('.content__mobile-tabs-menu li').on('click', function () {
		var text = $(this).text();
		var item = $(this);
		var id = item.closest('.content__mobile-tabs').attr('id');
		$('#' + id).find('.content__mobile-tabs-btn input').val(text);
	});

	/*==============================
	Section bg
	==============================*/
	$('.section--bg, .details__bg').each(function () {
		if ($(this).attr("data-bg")) {
			$(this).css({
				'background': 'url(' + $(this).data('bg') + ')',
				'background-position': 'center center',
				'background-repeat': 'no-repeat',
				'background-size': 'cover'
			});
		}
	});

	/*==============================
	Filter
	==============================*/
	$('.filter__item-menu li').each(function () {
		$(this).attr('data-value', $(this).text().toLowerCase());
	});

	$('.filter__item-menu li').on('click', function () {
		var text = $(this).text();
		var item = $(this);
		var id = item.closest('.filter__item').attr('id');
		$('#' + id).find('.filter__item-btn input').val(text);
	});

	/*==============================
	Scroll bar
	==============================*/
	$('.scrollbar-dropdown').mCustomScrollbar({
		axis: "y",
		scrollbarPosition: "outside",
		theme: "custom-bar"
	});

	$('.accordion').mCustomScrollbar({
		axis: "y",
		scrollbarPosition: "outside",
		theme: "custom-bar2"
	});

	/*==============================
	Morelines
	==============================*/
	$('.card__description--details').moreLines({
		linecount: 6,
		baseclass: 'b-description',
		basejsclass: 'js-description',
		classspecific: '_readmore',
		buttontxtmore: "",
		buttontxtless: "",
		animationspeed: 400
	});

	/*==============================
	Gallery
	==============================*/
	var initPhotoSwipeFromDOM = function (gallerySelector) {
		// parse slide data (url, title, size ...) from DOM elements 
		// (children of gallerySelector)
		var parseThumbnailElements = function (el) {
			var thumbElements = el.childNodes,
				numNodes = thumbElements.length,
				items = [],
				figureEl,
				linkEl,
				size,
				item;

			for (var i = 0; i < numNodes; i++) {

				figureEl = thumbElements[i]; // <figure> element

				// include only element nodes 
				if (figureEl.nodeType !== 1) {
					continue;
				}

				linkEl = figureEl.children[0]; // <a> element

				size = linkEl.getAttribute('data-size').split('x');

				// create slide object
				item = {
					src: linkEl.getAttribute('href'),
					w: parseInt(size[0], 10),
					h: parseInt(size[1], 10)
				};

				if (figureEl.children.length > 1) {
					// <figcaption> content
					item.title = figureEl.children[1].innerHTML;
				}

				if (linkEl.children.length > 0) {
					// <img> thumbnail element, retrieving thumbnail url
					item.msrc = linkEl.children[0].getAttribute('src');
				}

				item.el = figureEl; // save link to element for getThumbBoundsFn
				items.push(item);
			}

			return items;
		};

		// find nearest parent element
		var closest = function closest(el, fn) {
			return el && (fn(el) ? el : closest(el.parentNode, fn));
		};

		// triggers when user clicks on thumbnail
		var onThumbnailsClick = function (e) {
			e = e || window.event;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;

			var eTarget = e.target || e.srcElement;

			// find root element of slide
			var clickedListItem = closest(eTarget, function (el) {
				return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
			});

			if (!clickedListItem) {
				return;
			}

			// find index of clicked item by looping through all child nodes
			// alternatively, you may define index via data- attribute
			var clickedGallery = clickedListItem.parentNode,
				childNodes = clickedListItem.parentNode.childNodes,
				numChildNodes = childNodes.length,
				nodeIndex = 0,
				index;

			for (var i = 0; i < numChildNodes; i++) {
				if (childNodes[i].nodeType !== 1) {
					continue;
				}

				if (childNodes[i] === clickedListItem) {
					index = nodeIndex;
					break;
				}
				nodeIndex++;
			}

			if (index >= 0) {
				// open PhotoSwipe if valid index found
				openPhotoSwipe(index, clickedGallery);
			}
			return false;
		};

		// parse picture index and gallery index from URL (#&pid=1&gid=2)
		var photoswipeParseHash = function () {
			var hash = window.location.hash.substring(1),
				params = {};

			if (hash.length < 5) {
				return params;
			}

			var vars = hash.split('&');
			for (var i = 0; i < vars.length; i++) {
				if (!vars[i]) {
					continue;
				}
				var pair = vars[i].split('=');
				if (pair.length < 2) {
					continue;
				}
				params[pair[0]] = pair[1];
			}

			if (params.gid) {
				params.gid = parseInt(params.gid, 10);
			}

			return params;
		};

		var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
			var pswpElement = document.querySelectorAll('.pswp')[0],
				gallery,
				options,
				items;

			items = parseThumbnailElements(galleryElement);

			// define options (if needed)
			options = {

				// define gallery index (for URL)
				galleryUID: galleryElement.getAttribute('data-pswp-uid'),

				getThumbBoundsFn: function (index) {
					// See Options -> getThumbBoundsFn section of documentation for more info
					var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
						pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
						rect = thumbnail.getBoundingClientRect();

					return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
				}

			};

			// PhotoSwipe opened from URL
			if (fromURL) {
				if (options.galleryPIDs) {
					// parse real index when custom PIDs are used 
					// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
					for (var j = 0; j < items.length; j++) {
						if (items[j].pid == index) {
							options.index = j;
							break;
						}
					}
				} else {
					// in URL indexes start from 1
					options.index = parseInt(index, 10) - 1;
				}
			} else {
				options.index = parseInt(index, 10);
			}

			// exit if index not found
			if (isNaN(options.index)) {
				return;
			}

			if (disableAnimation) {
				options.showAnimationDuration = 0;
			}

			// Pass data to PhotoSwipe and initialize it
			gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
			gallery.init();
		};

		// loop through all gallery elements and bind events
		var galleryElements = document.querySelectorAll(gallerySelector);

		for (var i = 0, l = galleryElements.length; i < l; i++) {
			galleryElements[i].setAttribute('data-pswp-uid', i + 1);
			galleryElements[i].onclick = onThumbnailsClick;
		}

		// Parse URL and open gallery if it contains #&pid=3&gid=1
		var hashData = photoswipeParseHash();
		if (hashData.pid && hashData.gid) {
			openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
		}
	};
	// execute above function
	initPhotoSwipeFromDOM('.gallery');

	/*==============================
	Player
	==============================*/
	function initializePlayer() {
		if ($('#player').length) {
			const player = new Plyr('#player');
		} else {
			return false;
		}
		return false;
	}
	$(window).on('load', initializePlayer());

	/*==============================
	Range sliders
	==============================*/
	/*1*/
	function initializeFirstSlider() {
		if ($('#filter__years').length) {
			var firstSlider = document.getElementById('filter__years');
			noUiSlider.create(firstSlider, {
				range: {
					'min': 2000,
					'max': 2022
				},
				step: 1,
				connect: true,
				start: [2005, 2022],
				format: wNumb({
					decimals: 0,
				})
			});
			var firstValues = [
				document.getElementById('filter__years-start'),
				document.getElementById('filter__years-end')
			];
			firstSlider.noUiSlider.on('update', function (values, handle) {
				firstValues[handle].innerHTML = values[handle];
			});
		} else {
			return false;
		}
		return false;
	}
	$(window).on('load', initializeFirstSlider());

	/*2*/
	function initializeSecondSlider() {
		if ($('#filter__imbd').length) {
			var secondSlider = document.getElementById('filter__imbd');
			noUiSlider.create(secondSlider, {
				range: {
					'min': 0,
					'max': 10
				},
				step: 0.1,
				connect: true,
				start: [2.5, 8.6],
				format: wNumb({
					decimals: 1,
				})
			});

			var secondValues = [
				document.getElementById('filter__imbd-start'),
				document.getElementById('filter__imbd-end')
			];

			secondSlider.noUiSlider.on('update', function (values, handle) {
				secondValues[handle].innerHTML = values[handle];
			});

			$('.filter__item-menu--range').on('click.bs.dropdown', function (e) {
				e.stopPropagation();
				e.preventDefault();
			});
		} else {
			return false;
		}
		return false;
	}
	$(window).on('load', initializeSecondSlider());

	/*3*/
	function initializeThirdSlider() {
		if ($('#slider__rating').length) {
			var thirdSlider = document.getElementById('slider__rating');
			noUiSlider.create(thirdSlider, {
				range: {
					'min': 0,
					'max': 10
				},
				connect: [true, false],
				step: 0.1,
				start: 8.6,
				format: wNumb({
					decimals: 1,
				})
			});

			var thirdValue = document.getElementById('form__slider-value');

			thirdSlider.noUiSlider.on('update', function (values, handle) {
				thirdValue.innerHTML = values[handle];
			});
		} else {
			return false;
		}
		return false;
	}
	$(window).on('load', initializeThirdSlider());
});


// *************************************************************************
// ***************************CATALOGUE*************************************
// *************************************************************************

const catalogueApplyButton = document.getElementById('apply');
if (catalogueApplyButton) {


	document.getElementById('apply').addEventListener('click', async () => {
		const genre = document.getElementById('genreName').value;
		const ratingLow = document.getElementById('filter__imbd-start').innerHTML;
		const ratingHigh = document.getElementById('filter__imbd-end').innerHTML;
		const year = document.getElementById('filter__years-end').innerHTML;
		//- create a link with data to make api request api
		// alert(genre + ' ' + ratingLow + ' ' + ratingHigh + ' ' + year);
		const apiLink = `http://127.0.0.1:3000/api/v1/movie?ratings[gte]=${ratingLow}&ratings[lte]=${ratingHigh}&year[eq]=${year}&genre=${genre}`;
		const movieData = await axios.get(apiLink);
		document.querySelector('.movie-card-container').innerHTML = '';
		let cardHTML = '';
		if (movieData.data.data.movies.length > 0) {
			for (i = 0; i < movieData.data.data.movies.length; i++) {
				const movie = movieData.data.data.movies[i];
				let genres = '';
				for (j = 0; j < movie.genre.length; j++) {
					genres += `<a href="#">${movie.genre[j]}</a>`;
				}
				const card = `<div class="col-6 col-sm-12 col-lg-6">
				<div class="card card--list">
					<div class="row">
						<div class="col-12 col-sm-4">
							<div class="card__cover">
								<img src="${movie.poster}" alt="${movie.name}" />
								<a class="card__play" href="/movie/${movie.slug}">
									<i class="icon ion-ios-play"></i>
								</a>
							</div>
						</div>
						<div class="col-12 col-sm-8">
							<div class="card__content">
								<h3 class="card__title">
									<a href="/movie/${movie.slug}">${movie.name}</a>
								</h3><span class="card__category">
									${genres}
								</span>
								<div class="card__wrap">
									<span class="card__rate">
										<i class="icon ion-ios-star">
										</i>${(Math.round(movie.ratings * 100) / 100).toFixed(1)}</span>
									<ul class="card__list">
										<li>HD</li>
										<li>${movie.pgRating}</li>
									</ul>
								</div>
								<div class="card__description">
									<p>${movie.description}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`;
				cardHTML += card;
			}
			document.querySelector('.movie-card-container').innerHTML = cardHTML;
		} else {
			document.querySelector('.movie-card-container').innerHTML = `<h2 style="color:#fff">No Results Found !!!</h2>`;
		}
		console.log(movieData);
	});
}
// *************************************************************************







// modal form
// const open = document.getElementById('open');
// const modal_container = document.getElementById('modal-container');
// const close = document.getElementById('close');

// open.addEventListener('click', () => {
// 	modal_container.classList.add('show');
// });

// close.addEventListener('click', () => {
// 	modal_container.classList.remove('show');
// });


// const openEdit = document.getElementById('openEdit');
// const closeEdit = document.getElementById('closeEdit');
// const editModal = document.getElementById('modal-container-edit');


// openEdit.addEventListener('click', () => {
// 	editModal.classList.add('show');
// 	console.log('click');
// });

// closeEdit.addEventListener('click', () => {
// 	editModal.classList.remove('show');
// });


const movSearch = document.getElementById('movSearch');// movie search form 

if (movSearch) {
	const movieSearchField = document.querySelector('.movieSearchField').value; //input field
	const movieSearchBtn = document.querySelector('.movieSearch'); // search btn
	movieSearchBtn.addEventListener('click', async (e) => {
		e.preventDefault();
		const query = `https://api.themoviedb.org/3/search/movie?api_key=bc9dabeae5a66fbe7bf887b0cb184612&query=${movieSearchField}`;

		// const res = await axios.get(query);
		console.log(movieSearchField);
	});
}


/********************************************************************** */


// modal form (Movie Search)
const open = document.getElementById('open');
const modal_container = document.getElementById('modal-container');
const close = document.getElementById('close');

// search movie in admin then panel the put value
if (open) {
	open.addEventListener('click', async () => {
		const searchValue = document.getElementById('searchMovieName').value;
		const searchYear = document.getElementById('searchMovieYear').value;
		const searchQuery = `https://api.themoviedb.org/3/search/movie?api_key=bc9dabeae5a66fbe7bf887b0cb184612&query=${searchValue}&year=${searchYear}`;
		const search = await axios.get(searchQuery);
		// console.log(search);
		document.querySelector('#found-cards').innerHTML = '';
		let putHTML = ``;
		if (search.data.results.length >= 0) {
			for (let i = 0; i < search.data.results.length; i++) {
				putHTML += `
					<div class="col-6 col-sm-12 col-lg-6">
					<div class="card">
						<div class="row">
							<div class="col-12 col-sm-4">
								<div class="card__cover">
									<img src="https://image.tmdb.org/t/p/w500${search.data.results[i].poster_path}" alt="">
									<a href="#" class="card__play">
										<i class="icon ion-ios-play"></i>
									</a>
								</div>
							</div>

							<div class="col-12 col-sm-8">
								<div class="card__content">
									<h3 class="card__title"><a href="#">${search.data.results[i].title}</a></h3>
									

									<div class="card__wrap">
										<ul class="card__list">
											<li>${search.data.results[i].release_date}</li>
										</ul>
									</div>
									<div class="comments__actions">
										<button type="button" onclick="setMovieDetailsInForm(this)" value="${search.data.results[i].id}"><i class="icon ion-ios-document"></i>Select</button>
										</div>
								</div>
							</div>
						</div>
					</div>
				</div>`;
				// console.log(search.data.results[i]);
			}
		} else {
			putHTML += `
			<div class="col-6 col-sm-12 col-lg-6">
				<div class="card">
					<div class="row">
						<div class="col-12 col-sm-4">
							<h1>Movie Not found</h1>
						</div>
					</div>
				</div>
			</div>`;
		}
		document.querySelector('#found-cards').innerHTML = putHTML;
		modal_container.classList.add('show');
	});
}

async function setMovieDetailsInForm(btn) {
	const id = btn.value;
	const searchQuery = `https://api.themoviedb.org/3/movie/${id}?api_key=bc9dabeae5a66fbe7bf887b0cb184612`;
	const movieData = await axios.get(searchQuery);
	const addMovName = document.getElementById('addMovName');
	const addMovLength = document.getElementById('addMovLength');
	const addMovDesc = document.getElementById('addMovDesc');
	const addMovPosterLink = document.getElementById('addMovPosterLink');
	const addMovReleaseYear = document.getElementById('addMovReleaseYear');
	const addMovGenre = document.getElementById('addMovGenre');
	const addMovBackdrop = document.getElementById('addMovBackdrop');

	addMovName.value = movieData.data.title;
	addMovLength.value = movieData.data.runtime;
	addMovDesc.value = movieData.data.overview;
	const poster = `https://image.tmdb.org/t/p/w500${movieData.data.poster_path}`;
	addMovPosterLink.value = poster;
	const year = movieData.data.release_date.split('-')[0];
	addMovReleaseYear.value = year;
	let genre = [];
	for (let i = 0; i < movieData.data.genres.length; i++) {
		genre.push(movieData.data.genres[i].name);
	}
	addMovGenre.value = genre;
	const backdrop = `https://image.tmdb.org/t/p/w500${movieData.data.backdrop_path}`;
	addMovBackdrop.value = backdrop;
	const searchValue = document.getElementById('searchMovieName');
	const searchYear = document.getElementById('searchMovieYear');
	searchValue.value = '';
	searchYear.value = '';
	modal_container.classList.remove('show');
}

if (close) {
	close.addEventListener('click', () => {
		modal_container.classList.remove('show');
	});
}


// Edit movie
const openEdit = document.getElementById('openEdit');
const closeEdit = document.getElementById('closeEdit');
const editModal = document.getElementById('modal-container-edit');

async function openMovieEditModalWithData(btn) {
	editModal.classList.add('show');
	let id = btn.value;
	const editMovName = document.getElementById('editMovName');
	const editMovLength = document.getElementById('editMovLength');
	const editMovDesc = document.getElementById('editMovDesc');
	const editMovPoster = document.getElementById('editMovPoster');
	const editMovYear = document.getElementById('editMovYear');
	const editMovTrailer = document.getElementById('editMovTrailer');
	const editMovGenre = document.getElementById('editMovGenre');
	const editMovPgRating = document.getElementById('editMovPgRating');
	const editMovBackdrop = document.getElementById('editMovBackdrop');
	const editMovRating = document.getElementById('editMovRating');
	const updateBtnId = document.getElementById('updateBtnId');

	const movieQuery = `http://127.0.0.1:3000/api/v1/movie/${id}`;
	const movieData = await axios.get(movieQuery);
	// console.log(movieData.data.data.movie.name);
	updateBtnId.value = id;
	editMovName.value = movieData.data.data.movie.name;
	editMovLength.value = movieData.data.data.movie.runTime;
	editMovDesc.value = movieData.data.data.movie.description;
	editMovPoster.value = movieData.data.data.movie.poster;
	editMovYear.value = movieData.data.data.movie.year;
	editMovTrailer.value = movieData.data.data.movie.trailerLink;
	let genres = [];
	for (let i = 0; i < movieData.data.data.movie.genre.length; i++) {
		genres.push(movieData.data.data.movie.genre[i]);
	}
	editMovGenre.value = genres;
	editMovPgRating.value = movieData.data.data.movie.pgRating;
	editMovBackdrop.value = movieData.data.data.movie.backdrop;
	editMovRating.value = movieData.data.data.movie.ratings;

}
if (closeEdit) {
	closeEdit.addEventListener('click', () => {
		editModal.classList.remove('show');
	});
}


// Update review
const reviewUpdateModal = document.getElementById('modal-container-updateReview');
const closeEditReview = document.getElementById('closeEditReview');

async function openReviewEditModal(btn) {
	reviewUpdateModal.classList.add('show');
	const editRevTitle = document.getElementById('editRevTitle');
	const editRevContent = document.getElementById('editRevContent');
	const editRevRating = document.getElementById('editRevRating');

	const reviewQuery = `http://127.0.0.1:3000/api/v1/review/${btn.value}`;
	const reviewData = await axios.get(reviewQuery);
	console.log(reviewData);

	editRevTitle.value = reviewData.data.data.data.reviewTitle;
	editRevContent.value = reviewData.data.data.data.reviewContent;
	editRevRating.value = reviewData.data.data.data.reviewRating;

}

if (closeEditReview) {
	closeEditReview.addEventListener('click', () => {
		reviewUpdateModal.classList.remove('show');
	});
}




// edit user
async function openUpdateUserModal(btn) {
	const modalUpdateUser = document.getElementById('modal-container-editUser');
	modalUpdateUser.classList.add('show');

	const userQuery = `http://127.0.0.1:3000/api/v1/user/${btn.value}`;
	const userData = await axios.get(userQuery);

	const editUserName = document.getElementById('editUserName');
	const editUserEmail = document.getElementById('editUserEmail');
	const editUserRole = document.getElementById('editUserRole');
	const editUserActive = document.getElementById('editUserActive');
	const editUserSubscription = document.getElementById('editUserSubscription');
	const editUserSubscriptionEnd = document.getElementById('editUserSubscriptionEnd');

	// To be used when pre selecting an option
	// document.getElementById("serviceType");
	// use if else to select the option (which is from database)
	const roleIndex = userData.data.data.user.role == 'admin' ? 0 : 1;
	editUserRole.selectedIndex = roleIndex;

	let activeIndex = 0;
	if (userData.data.data.user.active) {
		activeIndex = 0;
	} else {
		activeIndex = 1;
	}
	editUserActive.selectedIndex = activeIndex;

	const subscriptionIndex = userData.data.data.user.subscription == 'basic' ? 0 : userData.data.data.user.subscription == 'premium' ? 1 : userData.data.data.user.subscription == 'cinematic' ? 2 : 0;
	editUserSubscription.selectedIndex = subscriptionIndex;

	//To be used when updating the  data
	// const role = editUserRole.options[editUserRole.selectedIndex].value;
	editUserName.value = userData.data.data.user.name;
	editUserEmail.value = userData.data.data.user.email;
	editUserSubscriptionEnd.value = userData.data.data.user.subscriptionDuration;
	console.log(userData.data.data.user.subscriptionDuration);

};

const closeUserModal = document.getElementById('closeUserModal');
const userUpdateModal = document.getElementById('modal-container-editUser');
if (closeUserModal) {
	closeUserModal.addEventListener('click', () => {
		userUpdateModal.classList.remove('show');
	});
}



async function addMovieToWatchlist(btn) {
	const addQuery = `http://127.0.0.1:3000/api/v1/user/addToWatchlist/${btn.value}`;
	try {
		const added = await axios.put(addQuery);
		if (added.status == 200) {
			showAlert('success', added.data.message);
		} else {
			showAlert('error', added.data.message);
		}
	} catch (err) {
		showAlert('success', 'Error adding to watchlist');
	}
}

// REVIEWS

async function addMovieReview(btn) {
	const title = document.getElementById('reviewTitle').value;
	const body = document.getElementById('reviewBody').value;
	const rating = document.getElementById('form__slider-value').innerHTML;
	const data = btn.value.split('|');
	const movieId = data[0];
	const userId = data[1];
	try {
		const res = await axios({
			method: 'POST',
			url: `http://127.0.0.1:3000/api/v1/review`,
			data: {
				user: userId,
				movie: movieId,
				reviewTitle: title,
				reviewContent: body,
				reviewRating: rating
			}
		});
		if (res.data.status === 'success') {
			showAlert('success', 'Review added successfully');
			window.setTimeout(() => {
				location.reload();
			}, 1000);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
}


// Update User
async function updateCurrentUser() {
	try {
		const name = document.getElementById('userName').value;
		const email = document.getElementById('userEmail').value;
		console.log(name + '--' + email);
		const res = await axios({
			method: 'PATCH',
			url: 'http://127.0.0.1:3000/api/v1/user/updateMe',
			data: {
				email: email,
				name: name
			}
		});
		if (res.data.status === 'success') {
			showAlert('success', 'User updated successfully');
			window.setTimeout(() => {
				location.reload();
			}, 1000);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
}



// Add Movie
async function addMovie() {
	const addMovName = document.getElementById('addMovName').value;
	const addMovLength = document.getElementById('addMovLength').value;
	const addMovDesc = document.getElementById('addMovDesc').value;
	const addMovPosterLink = document.getElementById('addMovPosterLink').value;
	const addMovReleaseYear = document.getElementById('addMovReleaseYear').value;
	// const movieFile = document.getElementById('movieFileName').value;
	let trailerArr = document.getElementById('trailerLink').value;
	const trailerId = trailerArr.split('=');
	const trailer = `https://www.youtube.com/embed/${trailerId[1]}`;
	const addMovGenre = document.getElementById('addMovGenre').value;
	const genreArray = addMovGenre.split(',');
	const pgRating = document.getElementById('pgRating').value;
	const addMovBackdrop = document.getElementById('addMovBackdrop').value;
	const imdbRating = document.getElementById('form__slider-value').innerHTML;
	try {
		const movie = await axios({
			method: 'POST',
			url: 'http://127.0.0.1:3000/api/v1/movie',
			data: {
				name: addMovName,
				runTime: addMovLength,
				ratings: imdbRating,
				description: addMovDesc,
				poster: addMovPosterLink,
				year: addMovReleaseYear,
				movieLink: 'bigbuck.mp4', //faking name here
				trailerLink: trailer,
				genre: genreArray,
				pgRating: pgRating,
				backdrop: addMovBackdrop
			}
		});
		if (movie.data.status === 'success') {
			showAlert('success', 'Movie added successfully');
			window.setTimeout(() => {
				location.reload();
			}, 1000);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
}

// Update Movie
async function updateMovie(btn) {
	try {
		const id = btn.value;
		const editMovName = document.getElementById('editMovName').value;
		const editMovLength = document.getElementById('editMovLength').value;
		const editMovDesc = document.getElementById('editMovDesc').value;
		const editMovPoster = document.getElementById('editMovPoster').value;
		const editMovYear = document.getElementById('editMovYear').value;
		const editMovieFile = 'bigbuck.mp4';    // when file upload
		const editMovTrailer = document.getElementById('editMovTrailer').value;
		const editMovGenre = document.getElementById('editMovGenre').value;
		const genre = editMovGenre.split(',');
		const editMovPgRating = document.getElementById('editMovPgRating').value;
		const editMovBackdrop = document.getElementById('editMovBackdrop').value;
		const editMovRating = document.getElementById('editMovRating').value;

		const updateEndpoint = `http://127.0.0.1:3000/api/v1/movie/${id}`;

		const movie = await axios({
			method: 'PATCH',
			url: `http://127.0.0.1:3000/api/v1/movie/${id}`,
			data: {
				name: editMovName,
				runTime: editMovLength,
				ratings: editMovRating,
				description: editMovDesc,
				poster: editMovPoster,
				year: editMovYear,
				movieLink: 'bigbuck.mp4', //faking name here
				trailerLink: editMovTrailer,
				genre: genre,
				pgRating: editMovPgRating,
				backdrop: editMovBackdrop
			}
		});
		console.log(movie);

		if (movie.data.status == 'success') {
			editModal.classList.remove('show');
			showAlert('success', 'Movie updated successfully');
			window.setTimeout(() => {
				location.reload();
			}, 1500);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
}

// Delete Movie
async function deleteMovie(btn) {
	try {
		const id = btn.value;
		await axios.delete(`http://127.0.0.1:3000/api/v1/movie/${id}`);
		showAlert('success', 'Movie deleted successfully');
		window.setTimeout(() => {
			location.reload();
		}, 1000);
	} catch (err) {
		console.log(err);
		showAlert('error', err.response.data.message);
	}
}


// DeleteReviewAdmin
async function deleteReviewAdmin(btn) {
	try {
		const id = btn.value;
		await axios.delete(`http://127.0.0.1:3000/api/v1/review/${id}`);
		showAlert('success', 'Review deleted successfully');
		window.setTimeout(() => {
			location.reload();
		}, 1000);
	} catch (err) {
		console.log(err);
		showAlert('error', err.response.data.message);
	}
}




// Stripe payment
const stripe = Stripe('pk_test_51L5oipSICxPwE1EuSdZJewHG3Eea8Jy4gLhdYwxXBh5F0QTSHd9y9n7bKMikITSmK7v0jaH2uEBbgfV6ZddXHsFM00j2TFnsJB');

async function buyPremiumSubscription() {
	// get checkout session
	const session = await axios.get(`http://127.0.0.1:3000/api/v1/subscription/premium/checkout-session`);
	console.log(session);
	await stripe.redirectToCheckout({
		sessionId: session.data.session.id
	});
}

async function buyCinematicSubscription() {
	// get checkout session
	const session = await axios.get(`http://127.0.0.1:3000/api/v1/subscription/cinematic/checkout-session`);
	console.log(session);
	await stripe.redirectToCheckout({
		sessionId: session.data.session.id
	});
}