// Reusable code to get an autocomplete to work.
// Must be able to be ran several times in the same project.

// CONFIGURATION FOR AUTOCOMPLETE:
// fetchData() function to find movies
// renderOption() function that knows how to render a movie
// onOptionSelect() function that gets invoked when a user clicks an option
// root - element that the autocomplete should be rendered into

// createAutocomplete arguments are a "configuration object" having all the custom functions specifying how autocomplete should work inside our specific app

const createAutocomplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
<input class="input" placeholder="Search" />
<div class="dropdown">
  <div class="dropdown-menu">
    <div class="dropdown-content results"></div>
  </div>
</div>
`;

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const onInput = async (evt) => {
    const items = await fetchData(evt.target.value);

    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    resultsWrapper.innerHTML = "";

    dropdown.classList.add("is-active");

    //   Loop iterating over the list of options (e.g. movies, recipes, etc.) and creating div HTML elements for each of them:
    for (let item of items) {
      const option = document.createElement("a");

      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);

      option.addEventListener("click", () => {
        input.value = inputValue(item);
        dropdown.classList.remove("is-active");
        // helper function requesting and rendering more detailed info about the selected option:
        onOptionSelect(item);
      });

      resultsWrapper.appendChild(option);
    }
  };

  input.addEventListener("input", debounce(onInput, 1000));

  // Closes the dropdown list when the coursor is clicked outside of the .autocomplete root element
  document.addEventListener("click", (evt) => {
    if (!root.contains(evt.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
