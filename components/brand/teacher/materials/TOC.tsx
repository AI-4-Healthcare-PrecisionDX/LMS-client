'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUploadForm } from '@/hooks/useUploadForm';
import { FileUp, Save } from 'lucide-react';

export default function UploadForm({ sectionId }: { sectionId: string }) {
  const { formData, handleInputChange, handleSubmit, isLoading, isError } = useUploadForm(sectionId);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Upload Material</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="material_title" className="required">Material Title</Label>
          <Input
            id="material_title"
            name="material_title"
            value={formData.material_title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="material_type">Material Type</Label>
          <Input
            id="material_type"
            name="material_type"
            value={formData.material_type}
            onChange={handleInputChange}
            readOnly
          />
        </div>

        <div>
          <Label htmlFor="material_description">Description</Label>
          <Input
            id="material_description"
            name="material_description"
            value={formData.material_description}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="pdf_file" className="required">PDF File</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="pdf_file"
              name="pdf_file"
              type="file"
              accept="application/pdf"
              onChange={handleInputChange}
              required
              className="flex-grow"
            />
            <Button type="button" size="icon">
              <FileUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="json_file">JSON File (Optional)</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="json_file"
              name="json_file"
              type="file"
              accept="application/json"
              onChange={handleInputChange}
              className="flex-grow"
            />
            <Button type="button" size="icon">
              <FileUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading || !formData.pdf_file || !formData.material_title}
          className="w-full"
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Uploading...' : 'Upload Material'}
        </Button>

        {isError && (
          <p className="text-red-500">Upload failed. Please try again.</p>
        )}
      </form>
    </div>
  );
}