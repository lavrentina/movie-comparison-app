// Non-reusable code for this very specific project
// http://www.omdbapi.com/?apikey=[yourkey]&

const autoCompleteConfig = {
	renderOption(movie) {
		const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
		return `
    <img src="${imgSrc}"/>
    ${movie.Title} (${movie.Year})
    `;
	},

	inputValue(movie) {
		return movie.Title;
	},

	async fetchData(searchTerm) {
		const response = await axios.get("https://www.omdbapi.com/", {
			params: {
				apikey: "24f27a84",
				s: searchTerm,
			},
		});

		if (response.data.Error) {
			return [];
		}

		return response.data.Search;
	},
};

createAutocomplete({
	...autoCompleteConfig,
	root: document.querySelector("#left-autocomplete"),
	onOptionSelect(movie) {
		document.querySelector(".tutorial").classList.add("is-hidden");
		onMovieSelect(movie, document.querySelector("#left-summary"), "left");
	},
});

createAutocomplete({
	...autoCompleteConfig,
	root: document.querySelector("#right-autocomplete"),
	onOptionSelect(movie) {
		document.querySelector(".tutorial").classList.add("is-hidden");
		onMovieSelect(movie, document.querySelector("#right-summary"), "right");
	},
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
	const response = await axios.get("https://www.omdbapi.com/", {
		params: {
			apikey: "24f27a84",
			i: movie.imdbID,
		},
	});

	summaryElement.innerHTML = movieTemplate(response.data);

	if (side === "left") {
		leftMovie = response.data;
	} else {
		rightMovie = response.data;
	}

	// Checking if both sides are defined, so that we can run the comparison func:
	if (leftMovie && rightMovie) {
		runComparison();
	}
};

const runComparison = () => {
	const leftSideStats = document.querySelectorAll(
		"#left-summary .notification"
	);
	const rightSideStats = document.querySelectorAll(
		"#right-summary .notification"
	);

	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];

		const leftSideValue = parseFloat(leftStat.dataset.value);
		const rightSideValue = parseFloat(rightStat.dataset.value);

		if (rightSideValue > leftSideValue) {
			leftStat.classList.remove("is-primary");
			leftStat.classList.add("is-warning");
			rightStat.classList.remove("is-warning");
			rightStat.classList.add("is-primary");
		} else if (leftSideValue > rightSideValue) {
			rightStat.classList.remove("is-primary");
			rightStat.classList.add("is-warning");
			leftStat.classList.add("is-primary");
			leftStat.classList.remove("is-warning");
		} else {
			leftStat.classList.remove("is-primary", "is-warning");
			leftStat.classList.add("is-info");
			rightStat.classList.remove("is-primary", "is-warning");
			rightStat.classList.add("is-info");
		}
	});
};

// helper function rendering more detailed info about the selected movie by means of html
const movieTemplate = (movieDetail) => {
	const dollars = parseInt(
		movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
	);
	const runtime = parseInt(movieDetail.Runtime.replace(/min/g, ""));
	const metascore = parseInt(movieDetail.Metascore);
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));

	return `
  <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h2>${movieDetail.Title}</h2>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>
      </div>
    </div>
  </article>
  <article data-value=${runtime} class="notification is-primary">
    <p class="title">${movieDetail.Runtime}</p>
    <p class="subtitle">Runtime</p>
  </article>
  <article data-value=${dollars} class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>
  <article data-value=${metascore} class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>
  <article data-value=${imdbRating} class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>
  <article data-value=${imdbVotes} class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>
`;
};
