import React, { useState, useEffect } from 'react';
import { NewProductData } from '../types';
import Icon from '@/components/components/Icon';
import { ICONS } from '@/components/constants';
import { useToast } from '@/components/contexts/ToastContext';
import { generateStoryForArtwork } from '../services/geminiService';
import AiImageEditorModal from '@/components/components/AiImageEditorModal';
import { Product } from '../types';

interface SellerDashboardProps {
  onSave: (artworkData: NewProductData) => void;
  onCancel: () => void;
  artworkToEdit?: Product | null;
}

const artTypes = ["Paintings", "Digital Art", "Sculptures", "Photography", "Handicrafts", "Jewelry", "Textiles", "Pottery"];

const initialFormData: Partial<NewProductData> = {
  title: "",
  description: "",
  price: undefined,
  artType: artTypes[0],
  availability: "In Stock",
  tags: [],
  details: { dimensions: "", materials: "", creationDate: new Date().getFullYear().toString() },
  images: [],
};

const fileToGenerativePart = (file: File): Promise<{ mimeType: string; data: string; url: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const url = reader.result as string;
      const data = url.split(',')[1];
      const mimeType = url.split(';')[0].split(':')[1];
      resolve({ mimeType, data, url });
    };
    reader.onerror = error => reject(error);
  });

const SellerDashboard: React.FC<SellerDashboardProps> = ({ onSave, onCancel, artworkToEdit }) => {
  const [formData, setFormData] = useState<Partial<NewProductData>>(initialFormData);
  const [tagInput, setTagInput] = useState("");
  const [isStoryLoading, setIsStoryLoading] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const { addToast } = useToast();
  const [formDataValue, setFormDataValue] = useState<Partial<NewProductData>>({
    title: "",
    description: "",
    price: undefined,
    artType: "Paintings",
    tags: [],
    images: [],
  });

  const [previewArtwork, setPreviewArtwork] = useState<Partial<NewProductData>>(formData);

  useEffect(() => {
    if (artworkToEdit) {
      setFormData(artworkToEdit);
    } else {
      setFormData(initialFormData);
    }
  }, [artworkToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('details.')) {
      const detailKey = name.split('.')[1];
      setFormData(prev => ({ ...prev, details: { ...prev.details, [detailKey]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, price: value === '' ? undefined : parseFloat(value) }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !formData.tags?.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), newTag] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(tag => tag !== tagToRemove) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 4MB limit
        addToast("Image size cannot exceed 4MB.", "error");
        return;
      }
      try {
        const { mimeType, data, url } = await fileToGenerativePart(file);
        setFormData(prev => ({ ...prev, images: [url], imageMimeType: mimeType, rawImage: data }));
      } catch (error) {
        addToast("Failed to process image.", "error");
        console.error(error);
      }
    }
  };

  const handleGenerateStory = async () => {
    if (!formData.title) {
      addToast("Please enter a title first.", "info");
      return;
    }
    setIsStoryLoading(true);
    try {
      const story = await generateStoryForArtwork(formData.title, formData.artType!, formData.tags!);
      setFormData(prev => ({ ...prev, description: story }));
    } catch (error) {
      addToast("AI story generation failed.", "error");
    } finally {
      setIsStoryLoading(false);
    }
  };

  const sanitizeForFirestore = (obj: any) => {
    if (obj === undefined) return null;
    if (obj === null || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);

    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, sanitizeForFirestore(value)])
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.images?.length || !formData.price || !formData.artType) {
      addToast("Please fill all required fields and upload an image.", "error");
      return;
    }
    try {
      const sanitizedFormData = sanitizeForFirestore(formData);
      onSave(sanitizedFormData as NewProductData);
      if (!formData.title || !formData.description || !formData.price) return;
      setPreviewArtwork(formData as NewProductData);
    } catch (error: any) {
      console.error("Failed to list artwork: ", error);
      addToast(`Failed to list artwork: ${error.message || error}`, "error");
    }
  };


  const handleAiEditSave = (newImageDataUrl: string, newImageMimeType: string) => {
    setFormData(prev => ({
      ...prev,
      images: [newImageDataUrl],
      imageMimeType: newImageMimeType,
    }));
    setIsEditorOpen(false);
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-on-surface">{artworkToEdit ? 'Edit Your Artwork' : 'List Your Artwork'}</h1>
            <p className="text-on-surface-secondary mt-1">Fill in the details below to put your art up for sale.</p>
          </div>

          <div className="bg-surface rounded-lg shadow-lg border border-surface-border p-8 space-y-6">
            <h2 className="text-xl font-bold text-on-surface">Artwork Image</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col items-center justify-center w-full h-64 bg-background border-2 border-surface-border border-dashed rounded-lg cursor-pointer hover:bg-surface-hover relative">
                <input id="dropzone-file" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                {formData.images && formData.images.length > 0 ? (
                  <img src={formData.images[0]} alt="Artwork preview" className="object-contain max-h-full max-w-full rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <Icon name={ICONS.upload} className="text-4xl text-on-surface-secondary mb-3" />
                    <p className="mb-2 text-sm text-on-surface-secondary"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-on-surface-secondary">PNG, JPG or WEBP (MAX. 4MB)</p>
                  </div>
                )}
              </div>
              {formData.images && formData.images.length > 0 && (
                <div>
                  <h3 className="font-semibold text-on-surface">Image Tools</h3>
                  <p className="text-sm text-on-surface-secondary mb-4">Enhance your listing with AI.</p>
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(true)}
                    className="w-full flex items-center justify-center space-x-2 font-semibold py-2 px-4 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Icon name={ICONS.auto_awesome} className="text-lg" />
                    <span>Edit with AI</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-lg border border-surface-border p-8 space-y-6">
            <h2 className="text-xl font-bold text-on-surface">Artwork Details</h2>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-on-surface-secondary mb-1">Title*</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-on-surface-secondary mb-1">Description*</label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Describe your artwork or let AI create a story for you..."
                  className={`w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors pr-32 ${isStoryLoading ? 'border-primary/50' : ''}`}
                />
                <button
                  type="button"
                  onClick={handleGenerateStory}
                  disabled={isStoryLoading}
                  className="absolute bottom-3 right-3 flex items-center space-x-2 bg-primary/10 text-primary hover:bg-primary/20 font-semibold py-1 px-3 rounded-full text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Generate story with AI"
                >
                  <Icon name={ICONS.auto_awesome} className={`text-base ${isStoryLoading ? 'animate-spin' : ''}`} />
                  <span>{isStoryLoading ? 'Generating...' : 'Generate with AI'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-on-surface-secondary mb-1">Price (₹)*</label>
                <input type="number" id="price" name="price" value={formData.price ?? ''} onChange={handlePriceChange} required step="0.01" placeholder="e.g., 25000.00" className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="artType" className="block text-sm font-medium text-on-surface-secondary mb-1">Art Type*</label>
                <select id="artType" name="artType" value={formData.artType} onChange={handleChange} required className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {artTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-on-surface-secondary mb-1">Tags (separated by comma or Enter)</label>
              <div className="flex flex-wrap items-center gap-2 bg-background border border-surface-border rounded-lg px-3 py-2">
                {formData.tags?.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-primary hover:text-red-500"><Icon name={ICONS.close} className="text-sm" /></button>
                  </span>
                ))}
                <input type="text" id="tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder={formData.tags?.length === 0 ? "e.g., abstract, modern, oil" : ""} className="flex-grow bg-transparent focus:outline-none text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="details.dimensions" className="block text-sm font-medium text-on-surface-secondary mb-1">Dimensions</label>
                <input type="text" id="details.dimensions" name="details.dimensions" value={formData.details?.dimensions} onChange={handleChange} placeholder="e.g., 24x36 in" className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="details.materials" className="block text-sm font-medium text-on-surface-secondary mb-1">Materials</label>
                <input type="text" id="details.materials" name="details.materials" value={formData.details?.materials} onChange={handleChange} placeholder="e.g., Oil on canvas" className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={onCancel} className="bg-surface-hover text-on-surface font-bold py-2 px-6 rounded-lg hover:bg-surface-border transition-colors">Cancel</button>
            <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors">{artworkToEdit ? 'Save Changes' : 'List Artwork'}</button>
          </div>
        </form>
      </div>
      {isEditorOpen && formData.images && formData.imageMimeType && (
        <AiImageEditorModal
          imageDataUrl={formData.images[0]}
          mimeType={formData.imageMimeType}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleAiEditSave}
        />
      )}
    </main>
  );
};

export default SellerDashboard;
