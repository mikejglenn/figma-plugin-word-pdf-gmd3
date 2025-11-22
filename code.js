figma.showUI(__html__, { width: 400, height: 600 });

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'create-text') {
      const textNode = figma.createText();
      
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      
      textNode.characters = msg.content;
      
      textNode.fontSize = 16;
      textNode.lineHeight = { value: 24, unit: "PIXELS" };
      
      textNode.textAutoResize = "HEIGHT";
      textNode.resize(600, textNode.height);
      
      textNode.x = figma.viewport.center.x - 300;
      textNode.y = figma.viewport.center.y - textNode.height / 2;
      
      figma.currentPage.appendChild(textNode);
      
      figma.currentPage.selection = [textNode];
      figma.viewport.scrollAndZoomIntoView([textNode]);
      
      figma.ui.postMessage({
        type: 'text-created',
        success: true,
        message: 'Text added to Figma successfully!'
      });
      
    } else if (msg.type === 'export-pdf') {
      const textNodes = figma.currentPage.findAll(node => node.type === 'TEXT');
      
      if (textNodes.length === 0) {
        figma.ui.postMessage({
          type: 'export-pdf-error',
          message: 'No text nodes found in Figma to export'
        });
        return;
      }
      
      const figmaContent = textNodes.map(node => {
        return {
          text: node.characters,
          fontSize: node.fontSize,
          x: node.x,
          y: node.y
        };
      });
      
      figma.ui.postMessage({
        type: 'export-pdf-data',
        content: figmaContent
      });
      
    } else if (msg.type === 'cancel') {
      figma.closePlugin();
    }
    
  } catch (error) {
    figma.ui.postMessage({
      type: 'error',
      message: error.message
    });
  }
};

figma.on('close', () => {
  figma.closePlugin();
});
