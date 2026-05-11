export function showHidePitchInput() {
  const div = document.getElementById('pitchDistance').parentElement;
  document.getElementById('numberOfCavities').addEventListener("input", function() {
    if (this.value > 1) {
      div.style.display = 'block';
    } else {
      div.style.display = 'none';
    }
  })
}

export function showHideHRSNInput() {
  const div = document.getElementById('hotRunnerSer').parentElement;
  
  document.getElementById('hotRunnerMan').addEventListener("input", function() {
    if (this.value == 'n.a.') {
      div.style.display = 'none';
    } else {
      div.style.display = 'block';
    }
  })
}