"use client";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
// import { Download, Minus, Plus, RotateCcw, RotateCw } from "lucide-react";

import getCroppedImageBlobUrl from "../utils/cropImage";

import {
  Crop,
  Filter,
  SlidersHorizontal,
  Download,
  Upload,
  Square,
  RectangleVertical,
  RectangleHorizontal,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  RefreshCw,
  ImageIcon,
  Scan,
} from "lucide-react";

// lazy load
const Cropper = dynamic(() => import("react-easy-crop"), { ssr: false });

// const aspectPresets = [
//   { key: "square", label: "1:1", aspect: 1 },
//   { key: "standard", label: "4:3", aspect: 4 / 3 },
//   { key: "landscape", label: "16:9", aspect: 16 / 9 },
//   { key: "cover", label: "3:1", aspect: 3 / 1 },
// ];

const aspectPresets = [
  { key: "square", label: "1:1", icon: Square, aspect: 1, ratioKey: "square" },
  {
    key: "portrait",
    label: "3:4",
    icon: RectangleVertical,
    aspect: 3 / 4,
    ratioKey: "portrait",
  },
  {
    key: "landscape",
    label: "16:9",
    icon: RectangleHorizontal,
    aspect: 16 / 9,
    ratioKey: "landscape",
  },
  {
    key: "ultrawide",
    label: "3:1",
    icon: Scan,
    aspect: 3 / 1,
    ratioKey: "landscape",
  },
];

const ImageEditor = forwardRef(
  ({ initialImage = null, mode = "auto", activeStep = 0 }, ref) => {
    const [imageSrc, setImageSrc] = useState(initialImage);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // aspect handling: avatar -> square else default cover aspect
    const defaultAspectKey = mode === "avatar" ? "square" : "cover";
    const [aspectKey, setAspectKey] = useState(defaultAspectKey);
    const [aspect, setAspect] = useState(
      mode === "avatar"
        ? 1
        : aspectPresets.find((p) => p.key === defaultAspectKey)?.aspect || 3
    );

    // Adjust filters
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [grayscale, setGrayscale] = useState(0);

    useEffect(() => {
      setImageSrc(initialImage);
      // reset states when a new image opens
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setCroppedAreaPixels(null);
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setGrayscale(0);
    }, [initialImage]);

    useEffect(() => {
      if (!imageSrc) return;

      const applyStepChanges = async () => {
        // अगर crop complete है तो image regenerate करो
        if (activeStep === 1 && croppedAreaPixels) {
          const res = await getCroppedImageBlobUrl({
            imageSrc,
            pixelCrop: croppedAreaPixels,
            rotation,
            filters: filterString,
            outputWidth: mode === "avatar" ? 800 : 1584,
            outputHeight: mode === "avatar" ? 800 : 396,
          });

          if (res?.url) {
            setImageSrc(res.url); // ✅ अब step 1 में cropped image दिखेगी
          }
        }

        // Step 2 जाने से पहले filter image save करो
        if (activeStep === 2) {
          const res = await getCroppedImageBlobUrl({
            imageSrc,
            pixelCrop: { x: 0, y: 0, width: 800, height: 800 }, // full image
            rotation,
            filters: filterString,
          });

          if (res?.url) {
            setImageSrc(res.url); // ✅ अब adjustments में filtered image दिखेगी
          }
        }
      };

      applyStepChanges();
    }, [activeStep]);

    const filterString = useMemo(
      () =>
        `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%)`,
      [brightness, contrast, saturation, grayscale]
    );

    const onCropComplete = (_, pixels) => setCroppedAreaPixels(pixels || null);

    // Expose exportImage so parent/modal can call it
    useImperativeHandle(ref, () => ({
      async exportImage() {
        if (!imageSrc) return null;

        // ensure we have pixelCrop; if not, fallback to full image
        let pixelCrop = croppedAreaPixels;
        // if missing crop area, build full-image crop using actual image dims
        if (!pixelCrop) {
          // load real image to get dims
          const img = await loadImage(imageSrc);
          pixelCrop = { x: 0, y: 0, width: img.width, height: img.height };
        }

        // pick output size by mode
        let outputWidth = null;
        let outputHeight = null;
        if (mode === "avatar") {
          outputWidth = 800;
          outputHeight = 800;
        } else if (mode === "cover") {
          outputWidth = 1584;
          outputHeight = 396;
        } // else null -> use cropped size

        try {
          const res = await getCroppedImageBlobUrl({
            imageSrc,
            pixelCrop,
            rotation,
            filters: filterString,
            outputWidth,
            outputHeight,
            mimeType: mode === "avatar" ? "image/png" : "image/jpeg",
            quality: 0.92,
          });
          return res; // { blob, url }
        } catch (err) {
          console.error("Export failed", err);
          return null;
        }
      },
    }));

    // small UI components (sliders/buttons)
    return (
      <div className="p-3 flex flex-col gap-3">
        {/* Canvas */}
        <div className="relative w-full h-72  rounded overflow-hidden">
          {imageSrc ? (
            activeStep === 0 ? (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{ containerStyle: { filter: filterString } }}
              />
            ) : (
              // show plain image with filters applied (no thumbnail strip)
              <img
                src={imageSrc}
                alt="editing"
                className="w-full h-full object-contain"
                style={{ filter: filterString }}
              />
            )
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* Controls per step */}
        {activeStep === 0 && (
          <div className="space-y-3">
            <div className="flex justify-center gap-2 flex-wrap">
              {aspectPresets.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => {
                    setAspectKey(p.key);
                    setAspect(p.aspect);
                  }}
                  className={`px-3 py-1 hover:cursor-pointer rounded ${
                    aspectKey === p.key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-4">
         
              <div className="w-full">
                <label className="text-sm text-white">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="
    w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer
    accent-blue-500
  "
                />
              </div>
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="space-y-3">
            {/* Filters presets (no thumbnails) — clicking changes sliders */}
            <div className="flex gap-3 flex-wrap">
              {[
                { name: "Original", preset: null },
                {
                  name: "Studio",
                  preset: { contrast: 120, brightness: 105, saturation: 110 },
                },
                { name: "Spot", preset: { brightness: 120, saturation: 110 } },
                { name: "Classic", preset: { grayscale: 50 } },
                {
                  name: "Warm",
                  preset: { brightness: 110, saturation: 120, contrast: 105 },
                },
                {
                  name: "Cool",
                  preset: { brightness: 95, saturation: 90, contrast: 110 },
                },
                {
                  name: "Vintage",
                  preset: {
                    contrast: 90,
                    brightness: 105,
                    saturation: 80,
                    grayscale: 20,
                  },
                },
                { name: "Mono", preset: { grayscale: 100 } },
              ].map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!p.preset) {
                      setBrightness(100);
                      setContrast(100);
                      setSaturation(100);
                      setGrayscale(0);
                    } else {
                      setBrightness(p.preset.brightness ?? 100);
                      setContrast(p.preset.contrast ?? 100);
                      setSaturation(p.preset.saturation ?? 100);
                      setGrayscale(p.preset.grayscale ?? 0);
                    }
                  }}
                  className="bg-transparent text-white hover:cursor-pointer rounded"
                  type="button"
                >
                  <img
                    src={imageSrc}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded shadow"
                    style={{
                      filter: p.preset
                        ? `brightness(${
                            p.preset.brightness ?? 100
                          }%) contrast(${p.preset.contrast ?? 100}%) saturate(${
                            p.preset.saturation ?? 100
                          }%) grayscale(${p.preset.grayscale ?? 0}%)`
                        : "none",
                    }}
                  />
                  <span className="text-[10px]">{p.name}</span>
                </button>
              ))}
            </div>


          </div>
        )}
        {activeStep === 2 && (
          <div className="space-y-3">
            <h5 className=" text-white font-semibold">Final adjustments</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Brightness */}
              <div>
                <div className="text-xs mb-1 text-gray-300">Brightness</div>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="text-xs mb-1 text-gray-300">Contrast</div>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Saturation */}
              <div>
                <div className="text-xs mb-1 text-gray-300">Saturation</div>
                <input
                  type="range"
                  min={50}
                  max={200}
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Grayscale */}
              <div>
                <div className="text-xs mb-1 text-gray-300">Grayscale</div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={grayscale}
                  onChange={(e) => setGrayscale(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

            </div>
          </div>
        )}
      </div>
    );
  }
);

export default ImageEditor;





const filterPresets = [
  { name: "Original", preset: null },
  { name: "Studio", preset: { contrast: 120, brightness: 105, saturation: 110 } },
  { name: "Spot", preset: { brightness: 120, saturation: 110 } },
  { name: "Classic", preset: { grayscale: 50 } },
  { name: "Warm", preset: { brightness: 110, saturation: 120, contrast: 105 } },
  { name: "Cool", preset: { brightness: 95, saturation: 90, contrast: 110 } },
  { name: "Vintage", preset: { contrast: 90, brightness: 105, saturation: 80, grayscale: 20 } },
  { name: "Mono", preset: { grayscale: 100 } },
];

// export const ImageEditorPost = forwardRef(({ initialImage = null, mode = "auto" }, ref) => {
//   // core states
//   const [imageSrc, setImageSrc] = useState(initialImage);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [rotation, setRotation] = useState(0);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

//   // UI modes: "crop" | "filter" | "adjust"
//   const [editorMode, setEditorMode] = useState("crop");

//   // aspect handling
//   const [aspectKey, setAspectKey] = useState("square");
//   const [aspect, setAspect] = useState(1);

//   // filter / adjust states
//   const [brightness, setBrightness] = useState(100);
//   const [contrast, setContrast] = useState(100);
//   const [saturation, setSaturation] = useState(100);
//   const [grayscale, setGrayscale] = useState(0);

//   // sync incoming image
//   useEffect(() => {
//     setImageSrc(initialImage);
//     setCrop({ x: 0, y: 0 });
//     setZoom(1);
//     setRotation(0);
//     setCroppedAreaPixels(null);
//     setBrightness(100);
//     setContrast(100);
//     setSaturation(100);
//     setGrayscale(0);
//   }, [initialImage]);

//   const filterString = useMemo(
//     () => `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%)`,
//     [brightness, contrast, saturation, grayscale]
//   );

//   const rotateLeft = () => setRotation((r) => (r - 90 + 360) % 360);
//   const rotateRight = () => setRotation((r) => (r + 90) % 360);

//   const onCropComplete = (_, pixels) => setCroppedAreaPixels(pixels || null);

//   // expose exportImage
//   useImperativeHandle(ref, () => ({
//     async exportImage({ variant = "large", ratio = "square" } = {}) {
//       if (!imageSrc) return null;

//       let pixelCrop = croppedAreaPixels;
//       if (!pixelCrop) {
//         const img = await loadImage(imageSrc);
//         pixelCrop = { x: 0, y: 0, width: img.width, height: img.height };
//       }

//       try {
//         const res = await getCroppedImageBlobUrl({
//           imageSrc,
//           pixelCrop,
//           rotation,
//           filters: filterString,
//           variant,
//           ratio,
//           mimeType: mode === "avatar" ? "image/png" : "image/jpeg",
//           quality: 0.94,
//         });
//         return res;
//       } catch (err) {
//         console.error("Export failed", err);
//         return null;
//       }
//     },
//   }));

//   // small helpers
//   const applyPreset = (p) => {
//     if (!p || !p.preset) {
//       setBrightness(100);
//       setContrast(100);
//       setSaturation(100);
//       setGrayscale(0);
//     } else {
//       setBrightness(p.preset.brightness ?? 100);
//       setContrast(p.preset.contrast ?? 100);
//       setSaturation(p.preset.saturation ?? 100);
//       setGrayscale(p.preset.grayscale ?? 0);
//     }
//   };

//   return (
//     <div className="rounded-lg mt-5 p-3 text-white w-full max-w-4xl mx-auto">
//       {/* header / tabs */}
//       <div className="flex items-center justify-between  mb-3">
//         <div className="flex gap-2">
//           <button
//             onClick={() => setEditorMode("crop")}
//             className={`flex  items-center px-3 py-1 rounded ${editorMode === "crop" ? "text-blue-600 " : "text-gray-800"}`}
//             type="button"
//           >
//             <Crop className="inline-block w-4 h-4 mr-2 -mt-0.5" /> Crop
//           </button>
//           <button
//             onClick={() => setEditorMode("filter")}
//             className={`flex  items-center px-3 py-1 rounded ${editorMode === "filter" ? "text-blue-600 " : "text-gray-800"}`}
//             type="button"
//           >
//             <Filter className="inline-block w-4 h-4 mr-2 -mt-0.5" /> Filters
//           </button>
//           <button
//             onClick={() => setEditorMode("adjust")}
//             className={`flex  items-center px-3 py-1 rounded ${editorMode === "adjust" ? "text-blue-600 " : "text-gray-800"}`}
//             type="button"
//           >
//             <SlidersHorizontal className="inline-block w-4 h-4 mr-2 -mt-0.5" /> Adjust
//           </button>
//         </div>

//       </div>

//       {/* Canvas area */}
//       <div className="max-w-[] relative max-w-4xl h-[370px] bg-[#050505] rounded overflow-hidden flex items-center justify-center">
//         {imageSrc ? (
//           // Crop view: we show Cropper only in crop mode. In filter/adjust modes we show a plain img with applied filters.
//           editorMode === "crop" ? (
//             <Cropper
//               image={imageSrc}
//               crop={crop}
//               zoom={zoom}
//               rotation={rotation}
//               aspect={aspect}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//               cropShape="rect"
//               showGrid={false}
//               objectFit="horizontal-cover"
//               style={{
//                 containerStyle: { background: "transparent" },
//                 mediaStyle: { filter: "none" }, // NO filter during crop — prevents dim / blur
//                 cropAreaStyle: {
//                   border: "2px solid rgba(255,255,255,0.95)",
//                   borderRadius: "6px",
//                 },
//               }}
//             />
//           ) : (
//             // Filter/Adjust preview: plain image with CSS filters
//             <img
//               src={imageSrc}
//               alt="preview"
//               className="max-h-full max-w-full object-contain"
//               style={{ filter: editorMode === "filter" || editorMode === "adjust" ? filterString : "none" }}
//             />
//           )
//         ) : (
//           <div className="h-full flex items-center justify-center text-gray-500">
//             <ImageIcon className="w-12 h-12" />
//           </div>
//         )}
//       </div>

//       {/* Bottom controls */}
//       <div className="mt-3">
//         {/* Aspect icons */}
//         <div className="flex justify-center gap-2 mb-3">
//           {aspectPresets.map((p) => {
//             const Icon = p.icon;
//             const active = aspectKey === p.key;
//             return (
//               <button
//                 key={p.key}
//                 type="button"
//                 onClick={() => {
//                   setAspectKey(p.key);
//                   setAspect(p.aspect);
//                 }}
//                 className={`p-2 rounded-md transition ${active ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}`}
//               >
//                 <Icon className="w-5 h-5" />
//               </button>
//             );
//           })}
//         </div>

//         {/* mode-specific UIs */}
//         {editorMode === "filter" && (
//           <>
//             {/* Filter presets row */}
//             <div className="flex gap-3 max-w-[460px]  moverflow-x-auto py-2">
//               {filterPresets.map((p, i) => (
//                 <button
//                   key={i}
//                   type="button"
//                   onClick={() => applyPreset(p)}
//                   className="flex-shrink-0 w-20 text-center"
//                 >
//                   <div
//                     className="w-20 h-12 rounded mt-20  overflow-hidden mb-1 border"
//                     style={{
//                       backgroundImage: `url(${imageSrc})`,
//                       backgroundSize: "cover",
//                       backgroundPosition: "center",
//                       filter: p.preset
//                         ? `brightness(${p.preset.brightness ?? 100}%) contrast(${p.preset.contrast ?? 100}%) saturate(${p.preset.saturation ?? 100}%) grayscale(${p.preset.grayscale ?? 0}%)`
//                         : "none",
//                     }}
//                   />
//                   <div className="text-[11px] text-gray-300">{p.name}</div>
//                 </button>
//               ))}
//             </div>
//           </>
//         )}

//         {editorMode === "adjust" && (
//           <div className="grid grid-cols-2 gap-3 mt-3">
//             <div>
//               <div className="text-xs text-gray-300">Brightness</div>
//               <input type="range" min={50} max={150} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full" />
//             </div>
//             <div>
//               <div className="text-xs text-gray-300">Contrast</div>
//               <input type="range" min={50} max={150} value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full" />
//             </div>
//             <div>
//               <div className="text-xs text-gray-300">Saturation</div>
//               <input type="range" min={50} max={200} value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full" />
//             </div>
//             <div>
//               <div className="text-xs text-gray-300">Grayscale</div>
//               <input type="range" min={0} max={100} value={grayscale} onChange={(e) => setGrayscale(Number(e.target.value))} className="w-full" />
//             </div>
//           </div>
//         )}

//         {/* Save / actions row */}
//         <div className="flex items-center justify-between gap-2 mt-4">
//           <div className="text-sm text-gray-300">Preview: {editorMode.toUpperCase()}</div>

//           <div className="flex items-center gap-2">
//             <button
//               className="px-3 py-1 bg-gray-800 rounded-md text-sm"
//               type="button"
//               onClick={async () => {
//                 // quick export medium square and download
//                 if (!imageSrc) return;
//                 const res = await (ref?.current?.exportImage ? ref.current.exportImage({ variant: "medium", ratio: "square" }) : null);
//                 if (res?.url) {
//                   const a = document.createElement("a");
//                   a.href = res.url;
//                   a.download = "image-edited.jpg";
//                   document.body.appendChild(a);
//                   a.click();
//                   a.remove();
//                 }
//               }}
//             >
//               <Download className="inline-block w-4 h-4 mr-2 -mt-0.5" />
//               Save
//             </button>

//             <button
//               className="px-3 py-1 bg-blue-600 rounded-md text-sm"
//               type="button"
//               onClick={async () => {
//                 // Export large landscape for example (parent will receive result)
//                 if (!ref || !ref.current) return;
//                 const res = await ref.current.exportImage({ variant: "large", ratio: aspectKey === "portrait" ? "portrait" : "landscape" });
//                 // return value usable by parent
//                 if (res?.url) {
//                   // you can upload blob or url
//                   // open preview in new tab:
//                   window.open(res.url, "_blank");
//                 }
//               }}
//             >
//               Export
//             </button>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// });


// const filterPresets = [
//   { name: "Original", preset: null },
//   { name: "Studio", preset: { contrast: 120, brightness: 105, saturation: 110 } },
//   { name: "Spot", preset: { brightness: 120, saturation: 110 } },
//   { name: "Classic", preset: { grayscale: 50 } },
//   { name: "Warm", preset: { brightness: 110, saturation: 120, contrast: 105 } },
//   { name: "Cool", preset: { brightness: 95, saturation: 90, contrast: 110 } },
//   { name: "Vintage", preset: { contrast: 90, brightness: 105, saturation: 80, grayscale: 20 } },
//   { name: "Mono", preset: { grayscale: 100 } },
// ];

// Aspect ratio presets with icons
// const aspectPresets = [
//   { key: "square", name: "Square", aspect: 1, icon: Square },
//   { key: "portrait", name: "Portrait", aspect: 9/16, icon: RectangleVertical },
//   { key: "landscape", name: "Landscape", aspect: 16/9, icon: RectangleHorizontal },
// ];

// Zoom levels
const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];

export const ImageEditorPost = forwardRef(({ initialImage = null, mode = "auto" }, ref) => {
  // core states
  const [imageSrc, setImageSrc] = useState(initialImage);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // UI modes: "crop" | "filter" | "adjust"
  const [editorMode, setEditorMode] = useState("crop");

  // aspect handling
  const [aspectKey, setAspectKey] = useState("square");
  const [aspect, setAspect] = useState(1);

  // filter / adjust states
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [grayscale, setGrayscale] = useState(0);

  // sync incoming image
  useEffect(() => {
    setImageSrc(initialImage);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrayscale(0);
    setAspectKey("square");
    setAspect(1);
  }, [initialImage]);

  const filterString = useMemo(
    () => `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%)`,
    [brightness, contrast, saturation, grayscale]
  );

  // Rotation functions
  const rotateLeft = () => setRotation((r) => (r - 90 + 360) % 360);
  const rotateRight = () => setRotation((r) => (r + 90) % 360);

  // Zoom functions
  const zoomIn = () => {
    setZoom((z) => Math.min(z * 1.2, 5)); // Max zoom 5x
  };

  const zoomOut = () => {
    setZoom((z) => Math.max(z / 1.2, 0.1)); // Min zoom 0.1x
  };

  const resetZoom = () => setZoom(1);

  const onCropComplete = (_, pixels) => setCroppedAreaPixels(pixels || null);

  // expose exportImage
  useImperativeHandle(ref, () => ({
    async exportImage({ variant = "large", ratio = "square" } = {}) {
      if (!imageSrc) return null;

      let pixelCrop = croppedAreaPixels;
      if (!pixelCrop) {
        const img = await loadImage(imageSrc);
        pixelCrop = { x: 0, y: 0, width: img.width, height: img.height };
      }

      try {
        const res = await getCroppedImageBlobUrl({
          imageSrc,
          pixelCrop,
          rotation,
          filters: filterString,
          variant,
          ratio,
          mimeType: mode === "avatar" ? "image/png" : "image/jpeg",
          quality: 0.94,
        });
        return res;
      } catch (err) {
        console.error("Export failed", err);
        return null;
      }
    },
  }));

  // small helpers
  const applyPreset = (p) => {
    if (!p || !p.preset) {
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setGrayscale(0);
    } else {
      setBrightness(p.preset.brightness ?? 100);
      setContrast(p.preset.contrast ?? 100);
      setSaturation(p.preset.saturation ?? 100);
      setGrayscale(p.preset.grayscale ?? 0);
    }
  };

  // Handle aspect ratio change
  const handleAspectChange = (preset) => {
    setAspectKey(preset.key);
    setAspect(preset.aspect);
    
    // Reset crop position when aspect changes
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="rounded-lg w-[] mt-5 p-3 text-white w-full max-w-4xl mx-auto">
      {/* header / tabs */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setEditorMode("crop")}
            className={`flex items-center px-3 py-1 rounded ${
              editorMode === "crop" 
                ? "text-blue-600 bg-blue-100" 
                : "text-gray-800 hover:bg-gray-100"
            }`}
            type="button"
          >
            <Crop className="inline-block w-4 h-4 mr-2" /> Crop
          </button>
          <button
            onClick={() => setEditorMode("filter")}
            className={`flex items-center px-3 py-1 rounded ${
              editorMode === "filter" 
                ? "text-blue-600 bg-blue-100" 
                : "text-gray-800 hover:bg-gray-100"
            }`}
            type="button"
          >
            <Filter className="inline-block w-4 h-4 mr-2" /> Filters
          </button>
          <button
            onClick={() => setEditorMode("adjust")}
            className={`flex items-center px-3 py-1 rounded ${
              editorMode === "adjust" 
                ? "text-blue-600 bg-blue-100" 
                : "text-gray-800 hover:bg-gray-100"
            }`}
            type="button"
          >
            <SlidersHorizontal className="inline-block w-4 h-4 mr-2" /> Adjust
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="relative max-w-4xl h-[370px] bg-[#050505] rounded overflow-hidden flex items-center justify-center">
        {imageSrc ? (
          editorMode === "crop" ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape="rect"
              showGrid={false}
              objectFit="horizontal-cover"
              style={{
                containerStyle: { background: "transparent" },
                mediaStyle: { filter: "none" },
                cropAreaStyle: {
                  border: "2px solid rgba(255,255,255,0.95)",
                  borderRadius: "6px",
                },
              }}
            />
          ) : (
            <img
              src={imageSrc}
              alt="preview"
              className="max-h-full max-w-full object-contain"
              style={{ filter: editorMode === "filter" || editorMode === "adjust" ? filterString : "none" }}
            />
          )
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <ImageIcon className="w-12 h-12" />
          </div>
        )}
        
        {/* Zoom and Rotation Controls (floating) */}
        {editorMode === "crop" && imageSrc && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 rounded-lg p-2">
            <button
              onClick={zoomOut}
              className="p-2 rounded hover:bg-gray-700"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            
            <div className="text-sm px-2 min-w-[50px] text-center">
              {Math.round(zoom * 100)}%
            </div>
            
            <button
              onClick={zoomIn}
              className="p-2 rounded hover:bg-gray-700"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            
            <div className="h-6 w-px bg-gray-600 mx-1"></div>
            
            <button
              onClick={rotateLeft}
              className="p-2 rounded hover:bg-gray-700"
              title="Rotate Left"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <button
              onClick={rotateRight}
              className="p-2 rounded hover:bg-gray-700"
              title="Rotate Right"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="mt-3">
        {/* Aspect ratio icons */}
        {editorMode === "crop" && (
          <div className="flex justify-center gap-3 mb-4">
            {aspectPresets.map((p) => {
              const Icon = p.icon;
              const active = aspectKey === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handleAspectChange(p)}
                  className={`flex flex-col items-center p-2 rounded-lg transition ${
                    active 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs">{p.name}</span>
                </button>
              );
            })}
            
            {/* Reset Zoom button */}
            <button
              type="button"
              onClick={resetZoom}
              className="flex flex-col items-center p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className="w-5 h-5 mb-1" />
              <span className="text-xs">Reset</span>
            </button>
          </div>
        )}

        {/* mode-specific UIs */}
        {editorMode === "filter" && (
          <>
            {/* Filter presets row */}
            <div className="flex gap-3 max-w-[460px] mx-auto overflow-x-auto py-2">
              {filterPresets.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="flex-shrink-0 w-20 text-center"
                >
                  <div
                    className="w-20 h-20 rounded-lg overflow-hidden mb-1 border-2 border-gray-700"
                    style={{
                      backgroundImage: `url(${imageSrc})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: p.preset
                        ? `brightness(${p.preset.brightness ?? 100}%) contrast(${p.preset.contrast ?? 100}%) saturate(${p.preset.saturation ?? 100}%) grayscale(${p.preset.grayscale ?? 0}%)`
                        : "none",
                    }}
                  />
                  <div className="text-sm text-gray-300">{p.name}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {editorMode === "adjust" && (
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Brightness</span>
                <span>{brightness}%</span>
              </div>
              <input 
                type="range" 
                min={50} 
                max={150} 
                value={brightness} 
                onChange={(e) => setBrightness(Number(e.target.value))} 
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Contrast</span>
                <span>{contrast}%</span>
              </div>
              <input 
                type="range" 
                min={50} 
                max={150} 
                value={contrast} 
                onChange={(e) => setContrast(Number(e.target.value))} 
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Saturation</span>
                <span>{saturation}%</span>
              </div>
              <input 
                type="range" 
                min={50} 
                max={200} 
                value={saturation} 
                onChange={(e) => setSaturation(Number(e.target.value))} 
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Grayscale</span>
                <span>{grayscale}%</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={100} 
                value={grayscale} 
                onChange={(e) => setGrayscale(Number(e.target.value))} 
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Save / Export buttons */}
        <div className="flex items-center justify-between gap-2 mt-4">
          <div className="text-sm text-gray-300">
            Mode: <span className="font-medium">{editorMode.toUpperCase()}</span> | 
            Aspect: <span className="font-medium">{aspectKey.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition"
              type="button"
              onClick={async () => {
                if (!imageSrc) return;
                const res = await (ref?.current?.exportImage ? 
                  ref.current.exportImage({ variant: "medium", ratio: "square" }) : null);
                if (res?.url) {
                  const a = document.createElement("a");
                  a.href = res.url;
                  a.download = "image-edited.jpg";
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Save
            </button>

            <button
              className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700 transition"
              type="button"
              onClick={async () => {
                if (!ref || !ref.current) return;
                const res = await ref.current.exportImage({ 
                  variant: "large", 
                  ratio: aspectKey === "portrait" ? "portrait" : "landscape" 
                });
                if (res?.url) {
                  window.open(res.url, "_blank");
                }
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// export const ImageEditorPost = forwardRef(
//   ({ initialImage = null, mode = "auto", activeStep = 0 }, ref) => {
//     const [imageSrc, setImageSrc] = useState(initialImage);
//     const [crop, setCrop] = useState({ x: 0, y: 0 });
//     const [zoom, setZoom] = useState(1);
//     const [rotation, setRotation] = useState(0);
//     const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

//     // aspect handling: avatar -> square else default cover aspect
//     const defaultAspectKey = mode === "avatar" ? "square" : "cover";
//     const [aspectKey, setAspectKey] = useState(defaultAspectKey);
//     const [aspect, setAspect] = useState(
//       mode === "avatar"
//         ? 1
//         : aspectPresets.find((p) => p.key === defaultAspectKey)?.aspect || 3
//     );

//     // Adjust filters
//     const [brightness, setBrightness] = useState(100);
//     const [contrast, setContrast] = useState(100);
//     const [saturation, setSaturation] = useState(100);
//     const [grayscale, setGrayscale] = useState(0);

//     useEffect(() => {
//       setImageSrc(initialImage);
//       // reset states when a new image opens
//       setCrop({ x: 0, y: 0 });
//       setZoom(1);
//       setRotation(0);
//       setCroppedAreaPixels(null);
//       setBrightness(100);
//       setContrast(100);
//       setSaturation(100);
//       setGrayscale(0);
//     }, [initialImage]);

//     useEffect(() => {
//       if (!imageSrc) return;

//       const applyStepChanges = async () => {
//         // अगर crop complete है तो image regenerate करो
//         if (activeStep === 1 && croppedAreaPixels) {
//           const res = await getCroppedImageBlobUrl({
//             imageSrc,
//             pixelCrop: croppedAreaPixels,
//             rotation,
//             filters: filterString,
//             outputWidth: mode === "avatar" ? 800 : 1584,
//             outputHeight: mode === "avatar" ? 800 : 396,
//           });

//           if (res?.url) {
//             setImageSrc(res.url); // ✅ अब step 1 में cropped image दिखेगी
//           }
//         }

//         // Step 2 जाने से पहले filter image save करो
//         if (activeStep === 2) {
//           const res = await getCroppedImageBlobUrl({
//             imageSrc,
//             pixelCrop: { x: 0, y: 0, width: 800, height: 800 }, // full image
//             rotation,
//             filters: filterString,
//           });

//           if (res?.url) {
//             setImageSrc(res.url); // ✅ अब adjustments में filtered image दिखेगी
//           }
//         }
//       };

//       applyStepChanges();
//     }, [activeStep]);

//     const filterString = useMemo(
//       () =>
//         `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%)`,
//       [brightness, contrast, saturation, grayscale]
//     );

//     const rotateLeft = () => setRotation((r) => (r - 90 + 360) % 360);
//     const rotateRight = () => setRotation((r) => (r + 90) % 360);

//     const onCropComplete = (_, pixels) => setCroppedAreaPixels(pixels || null);

//     // Expose exportImage so parent/modal can call it
//     useImperativeHandle(ref, () => ({
//       async exportImage() {
//         if (!imageSrc) return null;

//         // ensure we have pixelCrop; if not, fallback to full image
//         let pixelCrop = croppedAreaPixels;
//         // if missing crop area, build full-image crop using actual image dims
//         if (!pixelCrop) {
//           // load real image to get dims
//           const img = await loadImage(imageSrc);
//           pixelCrop = { x: 0, y: 0, width: img.width, height: img.height };
//         }

//         // pick output size by mode
//         let outputWidth = null;
//         let outputHeight = null;
//         if (mode === "avatar") {
//           outputWidth = 800;
//           outputHeight = 800;
//         } else if (mode === "cover") {
//           outputWidth = 1584;
//           outputHeight = 396;
//         } // else null -> use cropped size

//         try {
//           const res = await getCroppedImageBlobUrl({
//             imageSrc,
//             pixelCrop,
//             rotation,
//             filters: filterString,
//             outputWidth,
//             outputHeight,
//             mimeType: mode === "avatar" ? "image/png" : "image/jpeg",
//             quality: 0.92,
//           });
//           return res; // { blob, url }
//         } catch (err) {
//           console.error("Export failed", err);
//           return null;
//         }
//       },
//     }));

//     // small UI components (sliders/buttons)
//     return (
//       <div className="p-3 flex flex-col gap-3">
//         {/* Canvas */}
//         <div className="relative w-full h-72 ack/60 rounded overflow-hidden">
//           {imageSrc ? (
//             activeStep === 0 ? (
//               <Cropper
//                 image={imageSrc}
//                 crop={crop}
//                 zoom={zoom}
//                 rotation={rotation}
//                 aspect={aspect}
//                 onCropChange={setCrop}
//                 onZoomChange={setZoom}
//                 onCropComplete={onCropComplete}
//                 style={{ containerStyle: { filter: filterString } }}
//               />
//             ) : (
//               // show plain image with filters applied (no thumbnail strip)
//               <img
//                 src={imageSrc}
//                 alt="editing"
//                 className="w-full h-full object-contain"
//                 style={{ filter: filterString }}
//               />
//             )
//           ) : (
//             <div className="h-full flex items-center justify-center text-gray-400">
//               No image
//             </div>
//           )}
//         </div>

//         {/* Controls per step */}
//         {activeStep === 0 && (
//           <div className="space-y-3">
//             <div className="flex gap-2 flex-wrap">
//              {aspectPresets.map((p) => {
//     const Icon = p.icon;
//     return (
//       <button
//         key={p.key}
//         onClick={() => {
//           setAspectKey(p.key);
//           setAspect(p.aspect);
//         }}
//         className={`
//           p-2 rounded-lg transition
//           ${aspectKey === p.key ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}
//         `}
//       >
//         <Icon className="w-5 h-5" />
//       </button>
//     );
//   })}
//             </div>
//                           <div className="">
//                 <label className="text-sm text-white">Zoom</label>
//                 <input
//                   type="range"
//                   min={1}
//                   max={3}
//                   step={0.01}
//                   value={zoom}
//                   onChange={(e) => setZoom(Number(e.target.value))}
//                   className="
//     w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer
//     accent-blue-500
//   "
//                 />
//               </div>

//             {/* <div className="flex items-center justify-between gap-4">
         

//             </div> */}
//           </div>
//         )}

//         {activeStep === 1 && (
//           <div className="space-y-3">
//             {/* Filters presets (no thumbnails) — clicking changes sliders */}
//             <div className="flex gap-3 flex-wrap">
//               {[
//                 { name: "Original", preset: null },
//                 {
//                   name: "Studio",
//                   preset: { contrast: 120, brightness: 105, saturation: 110 },
//                 },
//                 { name: "Spot", preset: { brightness: 120, saturation: 110 } },
//                 { name: "Classic", preset: { grayscale: 50 } },
//                 {
//                   name: "Warm",
//                   preset: { brightness: 110, saturation: 120, contrast: 105 },
//                 },
//                 {
//                   name: "Cool",
//                   preset: { brightness: 95, saturation: 90, contrast: 110 },
//                 },
//                 {
//                   name: "Vintage",
//                   preset: {
//                     contrast: 90,
//                     brightness: 105,
//                     saturation: 80,
//                     grayscale: 20,
//                   },
//                 },
//                 { name: "Mono", preset: { grayscale: 100 } },
//               ].map((p, i) => (
//                 <button
//                   key={i}
//                   onClick={() => {
//                     if (!p.preset) {
//                       setBrightness(100);
//                       setContrast(100);
//                       setSaturation(100);
//                       setGrayscale(0);
//                     } else {
//                       setBrightness(p.preset.brightness ?? 100);
//                       setContrast(p.preset.contrast ?? 100);
//                       setSaturation(p.preset.saturation ?? 100);
//                       setGrayscale(p.preset.grayscale ?? 0);
//                     }
//                   }}
//                   className="bg-transparent text-white hover:cursor-pointer rounded"
//                   type="button"
//                 >
//                   <img
//                     src={imageSrc}
//                     alt={p.name}
//                     className="w-12 h-12 object-cover rounded shadow"
//                     style={{
//                       filter: p.preset
//                         ? `brightness(${
//                             p.preset.brightness ?? 100
//                           }%) contrast(${p.preset.contrast ?? 100}%) saturate(${
//                             p.preset.saturation ?? 100
//                           }%) grayscale(${p.preset.grayscale ?? 0}%)`
//                         : "none",
//                     }}
//                   />
//                   <span className="text-[10px]">{p.name}</span>
//                 </button>
//               ))}
//             </div>


//           </div>
//         )}
//         {activeStep === 2 && (
//           <div className="space-y-3">
//             <h5 className=" text-white font-semibold">Final adjustments</h5>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Brightness */}
//               <div>
//                 <div className="text-xs mb-1 text-gray-300">Brightness</div>
//                 <input
//                   type="range"
//                   min={50}
//                   max={150}
//                   value={brightness}
//                   onChange={(e) => setBrightness(Number(e.target.value))}
//                   className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
//                 />
//               </div>

//               {/* Contrast */}
//               <div>
//                 <div className="text-xs mb-1 text-gray-300">Contrast</div>
//                 <input
//                   type="range"
//                   min={50}
//                   max={150}
//                   value={contrast}
//                   onChange={(e) => setContrast(Number(e.target.value))}
//                   className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
//                 />
//               </div>

//               {/* Saturation */}
//               <div>
//                 <div className="text-xs mb-1 text-gray-300">Saturation</div>
//                 <input
//                   type="range"
//                   min={50}
//                   max={200}
//                   value={saturation}
//                   onChange={(e) => setSaturation(Number(e.target.value))}
//                   className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
//                 />
//               </div>

//               {/* Grayscale */}
//               <div>
//                 <div className="text-xs mb-1 text-gray-300">Grayscale</div>
//                 <input
//                   type="range"
//                   min={0}
//                   max={100}
//                   value={grayscale}
//                   onChange={(e) => setGrayscale(Number(e.target.value))}
//                   className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
// );

// helper
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}
