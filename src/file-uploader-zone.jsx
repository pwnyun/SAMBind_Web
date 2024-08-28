import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import {FaRegFileImage} from "react-icons/fa6";

export default function FileUploaderZone({file, setFile}) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = function () {
      // setPreview(file.result);
      console.log('acceptedFiles', acceptedFiles);
      console.log('file', file);
      // TODO 检查文件大小
      setFile(file);
    };

    reader.readAsDataURL(file);
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  function handleOnChange(e) {
    const target = e.target;

    // TODO 检查文件大小
    setFile(target.files[0]);
  }

  return (
    <>
      <div className="col-span-full">
        <div
          {...getRootProps()}
          className={`mt-2 flex h-48 justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 ${isDragActive ? 'bg-gray-400/10' : ''}`}
        >
          <div className="text-center">
            <div className="mx-auto w-12 h-12 my-4 text-gray-300">
              <FaRegFileImage aria-hidden="true" className="w-12 h-12" />
            </div>
            {
              file && (
                <>
                  <div className="mt-4 flex flex-col text-sm leading-6 text-gray-600">
                    <div className="font-bold">{file?.name}</div>
                    <div>{formatBytes(file?.size)}</div>
                  </div>
                </>
              )
            }
            {!file && (
              <>
                <div className={`mt-4 ${isDragActive ? 'hidden' : 'flex'} text-sm leading-6 text-gray-600`}>
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>选择一个文件</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleOnChange}
                      {...getInputProps()}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-2">或者将文件拖拽到此处</p>
                </div>
                <div className={`mt-4 ${isDragActive ? 'flex' : 'hidden'} text-sm leading-6 text-gray-600`}>
                  <p className="w-full self-center">请松开鼠标</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1048576) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else if (bytes < 1073741824) {
    return (bytes / 1048576).toFixed(2) + ' MB';
  } else {
    return (bytes / 1073741824).toFixed(2) + ' GB';
  }
}
