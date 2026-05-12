export function viewCheckbox(event, section, id, div) {
  event.preventDefault();
  const list = document.getElementById(id);

  list.classList.toggle('show');
  
  // Hides dropdowun menu when you click somwhere on the page
  document.getElementById(section).addEventListener("click", (e) => {
    const dropdown = document.querySelector(div);
    const list = document.getElementById(id);
    
    if (!dropdown.contains(e.target)) {
      list.classList.remove("show");
    };
  });
};