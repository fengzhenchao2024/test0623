import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { UploadedImage } from '../types';
import { formatBytes } from '../data';

interface ImageFilesUploadProps {
  images: UploadedImage[];
  onImagesChange: (imgs: UploadedImage[]) => void;
}

export default function ImageFilesUpload({ images, onImagesChange }: ImageFilesUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Handle standard file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  // Convert files to Base64 preview urls
  const processFiles = (files: FileList) => {
    const spaceLeft = 9 - images.length;
    if (spaceLeft <= 0) return;

    // Take up to the maximum remaining images allowed
    const filesToProcess = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, spaceLeft);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newImg: UploadedImage = {
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          url: reader.result as string,
          size: formatBytes(file.size),
        };
        onImagesChange([...images, newImg]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const triggerSelect = () => {
    if (images.length < 9) {
      fileInputRef.current?.click();
    }
  };

  const removeImage = (id: string) => {
    onImagesChange(images.filter((img) => img.id !== id));
  };

  return (
    <div id="image-upload-card" className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200 tracking-tight">图像参考配置 (最多 9 张图片)</h2>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
          {images.length} / 9 张
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-4 leading-normal">
        上传高质量参考图可大幅提升视频画面的结构一致性。支持多张参考图进行动作骨架引导与光影交融。
      </p>

      {/* Drag & Drop Zone */}
      {images.length < 9 && (
        <div
          id="dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerSelect}
          className={`group flex flex-col items-center justify-center border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
              : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 text-slate-500 hover:text-slate-400'
          }`}
        >
          <input
            id="hidden-file-input"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform border border-slate-850">
            <Upload className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-xs font-medium text-slate-300">
            点击或拖拽图片到此处上传
          </p>
          <p className="text-[10px] text-slate-600 mt-1">
            支持 PNG, JPG, JPEG, WebP 格式
          </p>
        </div>
      )}

      {images.length === 9 && (
        <div className="flex items-center gap-2 px-3 py-2 border border-amber-500/15 bg-amber-500/5 rounded-xl text-amber-500/90 text-xs mb-3">
          <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
          <span>图片数量已达最大限制 (9张)，如需继续添加，请先删除现有图片。</span>
        </div>
      )}

      {/* Render Previews Grid */}
      {images.length > 0 && (
        <div id="image-previews-grid" className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 xl:grid-cols-5 gap-3 mt-4">
          {images.map((img, idx) => (
            <div
              id={`preview-item-${img.id}`}
              key={img.id}
              className="group relative aspect-square border border-slate-800 rounded-lg overflow-hidden bg-slate-950 shadow-sm"
            >
              <img
                src={img.url}
                alt={img.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Image label index overlay */}
              <div className="absolute top-1 left-1 bg-slate-950/80 backdrop-blur-md text-[9px] font-semibold font-mono text-indigo-400 px-1.5 py-0.5 rounded-md border border-slate-800/80">
                #{idx + 1}
              </div>
              
              {/* Delete trigger overlay */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button
                  id={`delete-preview-${img.id}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="p-1.5 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white transition-colors shadow-md"
                  title="移除此图"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tooltip for file details */}
              <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] text-slate-400 truncate px-1 py-0.5 pointer-events-none group-hover:block hidden font-mono">
                {img.size}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
