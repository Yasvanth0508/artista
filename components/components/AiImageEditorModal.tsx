import React, { useState } from 'react';
import { useToast } from '../../components/contexts/ToastContext';
import { editImageWithAi } from '../../services/geminiService';

interface AiImageEditorModalProps {
  imageDataUrl: string;
  mimeType: string;
  onClose: () => void;
  onSave: (newImageDataUrl: string, newImageMimeType: string) => void;
}

const AiImageEditorModal: React.FC<AiImageEditorModalProps> = ({ imageDataUrl, mimeType, onClose, onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [editedImageMimeType, setEditedImageMimeType] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      addToast("Please enter an edit instruction.", "info");
      return;
    }
    setIsLoading(true);
    setEditedImageUrl(null);

    try {
      const base64Data = imageDataUrl.split(',')[1];
      const result = await editImageWithAi(base64Data, mimeType, prompt);
      if (result) {
        setEditedImageUrl(result.newImageDataUrl);
        setEditedImageMimeType(result.newImageMimeType);
        addToast("Image generated successfully!", "success");
      } else {
        addToast("The AI couldn't generate an image. Try a different prompt.", "error");
      }
    } catch (error) {
      addToast("Failed to edit image with AI.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = () => {
    if(editedImageUrl && editedImageMimeType) {
        onSave(editedImageUrl, editedImageMimeType);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-editor-modal-title"
    >
      <div
        className="bg-surface rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-surface-border flex justify-between items-center flex-shrink-0">
          <h2 id="ai-editor-modal-title" className="text-xl font-bold text-on-surface">AI Image Editor</h2>
          <button onClick={onClose} aria-label="Close modal" className="p-1 rounded-full hover:bg-surface-hover">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-on-surface-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-grow p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center space-y-2">
              <h3 className="font-semibold text-on-surface">Original</h3>
              <div className="w-full aspect-square bg-background rounded-lg overflow-hidden border border-surface-border">
                <img src={imageDataUrl} alt="Original" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <h3 className="font-semibold text-on-surface">Edited</h3>
              <div className="w-full aspect-square bg-background rounded-lg overflow-hidden border border-surface-border flex items-center justify-center text-on-surface-secondary">
                {isLoading && (
                  <div className="flex flex-col items-center justify-center">
                    <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-sm">Generating...</p>
                  </div>
                )}
                {editedImageUrl && !isLoading && <img src={editedImageUrl} alt="Edited with AI" className="w-full h-full object-contain" />}
                {!editedImageUrl && !isLoading && <div className="text-center p-4">AI-edited image will appear here</div>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'add a cat sitting on the vase' or 'change background to a starry night'"
              className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <button onClick={handleGenerate} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading || !prompt.trim()}>
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        <div className="flex-shrink-0 p-4 border-t border-surface-border bg-background flex justify-end items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-surface-hover text-on-surface font-bold py-2 px-6 rounded-lg hover:bg-surface-border transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!editedImageUrl || isLoading}
          >
            Save Image
          </button>
        </div>
      </div>
    </div>
  );
};
export default AiImageEditorModal;
