export function showHidePitchInput() {
  const div = document.getElementById('pitchDistance').parentElement;

  document.getElementById('numberOfCavities').addEventListener("input", function() {
    const value = Number(this.value.split('+')[0]);
    console.log(this.value, value);
    
    if (value > 1) {
      div.style.display = 'block';
    } else {
      div.style.display = 'none';
    }
  })
}

export function showHideHRSNInput() {
  const div = document.getElementById('hotRunnerSer').parentElement;
  
  document.getElementById('hotRunnerMan').addEventListener("input", function() {
    console.log(this.textContent);
    
    if (this.value == 'n.a.') {
      div.style.display = 'none';
    } else {
      div.style.display = 'block';
    }
  })
}

export function showHideVolumeElement() {
  const div = document.getElementById('volume').parentElement;
  
  document.getElementById('item-type').addEventListener("input", function() {
    if (this.value == 'Lid' || this.value == 'Handle') {
      div.style.display = 'none';
    } else {
      div.style.display = 'block';
    }
  })
}