// Sound notification utility
const successSound = new Audio('/sounds/success.mp3');
const deleteSound = new Audio('/sounds/delete.mp3');

export function playSuccessSound() {
  try {
    successSound.currentTime = 0; // Reset sound to start
    successSound.play().catch(err => {
      console.warn('Could not play success sound:', err);
    });
  } catch (err) {
    console.warn('Error playing success sound:', err);
  }
}

export function playDeleteSound() {
  try {
    deleteSound.currentTime = 0; // Reset sound to start
    deleteSound.play().catch(err => {
      console.warn('Could not play delete sound:', err);
    });
  } catch (err) {
    console.warn('Error playing delete sound:', err);
  }
}