import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Check, X, ZoomIn } from "lucide-react";

export function AvatarCropperModal({
  imageSrc,
  busy,
  onCancel,
  onConfirm,
}: {
  imageSrc: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: (croppedAreaPixels: Area) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onCancel}
          aria-label="Cancel"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <p className="text-sm font-semibold text-white">Drag to reposition</p>
        <button
          onClick={() => croppedAreaPixels && onConfirm(croppedAreaPixels)}
          disabled={!croppedAreaPixels || busy}
          aria-label="Confirm crop"
          className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
        >
          <Check className="h-5 w-5" />
        </button>
      </div>

      {/* The crop area itself — round to preview exactly how the avatar will look */}
      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          restrictPosition
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </div>

      <div className="flex items-center gap-3 bg-black px-6 py-5">
        <ZoomIn className="h-4 w-4 shrink-0 text-white/70" />
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          aria-label="Zoom"
          className="h-1.5 flex-1 accent-primary"
        />
      </div>
    </div>
  );
}
