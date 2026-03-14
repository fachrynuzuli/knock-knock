/**
 * WalkabilityMask
 *
 * Loads a walkability mask PNG into an off-screen canvas and provides
 * fast O(1) pixel sampling to determine whether a map coordinate is walkable.
 *
 * Convention: white pixel (R ≥ 128) = walkable, dark pixel = blocked.
 * The mask must be the same pixel dimensions as the game map (2048×1342).
 *
 * Fails open: while the mask is still loading, isWalkable() returns true
 * so the player is never stuck on startup.
 */

class WalkabilityMask {
  private imageData: ImageData | null = null;
  private width = 0;
  private height = 0;
  private ready = false;

  /**
   * Load the mask image and rasterise it into a pixel buffer.
   * Call once on Game mount — safe to call multiple times (no-op if already loaded).
   */
  async load(src: string): Promise<void> {
    if (this.ready) return;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('WalkabilityMask: could not get 2D canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        this.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.width = canvas.width;
        this.height = canvas.height;
        this.ready = true;
        resolve();
      };

      img.onerror = () => {
        // Fail open if the mask image can't be loaded
        this.ready = true;
        resolve();
      };

      img.src = src;
    });
  }

  /** Returns true when the mask has been loaded and is ready to sample. */
  isReady(): boolean {
    return this.ready;
  }

  /**
   * Sample a single pixel.
   * @param x  Map x-coordinate (pixels, unscaled)
   * @param y  Map y-coordinate (pixels, unscaled)
   * @returns  true = walkable, false = blocked
   */
  isWalkable(x: number, y: number): boolean {
    // Fail open while loading
    if (!this.ready || !this.imageData) return true;

    const px = Math.round(x);
    const py = Math.round(y);

    // Out-of-bounds coords are treated as blocked
    if (px < 0 || px >= this.width || py < 0 || py >= this.height) {
      return false;
    }

    // RGBA layout: index = (y * width + x) * 4
    const index = (py * this.width + px) * 4;
    const red = this.imageData.data[index]; // Red channel is enough for B&W mask

    return red >= 128; // white-ish = walkable
  }
}

// Export a singleton so the mask is only loaded once for the entire app lifetime
export const walkabilityMask = new WalkabilityMask();
