import { Resource } from "@/lib/types";
import { X } from "lucide-react";

interface ResourceItemProps {
  resource: Resource;
  onChange: (updatedResource: Partial<Resource>) => void;
  onRemove: () => void;
  isRemovable: boolean;
}

export default function ResourceItem({ resource, onChange, onRemove, isRemovable }: ResourceItemProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 resource-item border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="w-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Resource Type</label>
              <select 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={resource.type}
                onChange={(e) => onChange({ type: e.target.value as Resource["type"] })}
              >
                <option value="video">Video (YouTube, Vimeo, etc.)</option>
                <option value="article">Article/Website</option>
                <option value="pdf">PDF</option>
                <option value="image">Image</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input 
                type="text" 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                placeholder="Resource title"
                value={resource.title}
                onChange={(e) => onChange({ title: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input 
              type="url" 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
              placeholder="https://..."
              value={resource.url}
              onChange={(e) => onChange({ url: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
            <textarea 
              rows={2} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
              placeholder="Brief description of this resource"
              value={resource.description}
              onChange={(e) => onChange({ description: e.target.value })}
            ></textarea>
          </div>
        </div>
        <button 
          type="button" 
          className={`ml-4 mt-4 flex-shrink-0 text-gray-500 hover:text-gray-700 ${!isRemovable ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={onRemove}
          disabled={!isRemovable}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
