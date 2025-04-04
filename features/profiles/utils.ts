// Helper function to generate SVG placeholder images
export const generateSvgImage = (title: string): string => {
  const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
          <rect width="800" height="400" fill="#000" />
          <text 
            x="400" 
            y="200" 
            font-family="sans-serif" 
            font-size="18px" 
            font-weight="bold" 
            fill="#fff" 
            text-anchor="middle" 
            dominant-baseline="middle"
          >
            ${title}
          </text>
        </svg>
      `;

  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
};
