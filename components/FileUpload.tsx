"use client"

import { useRef, useState } from "react";
import config from "@/lib/config";
import { IKContext, IKImage, IKUpload } from 'imagekitio-react';
import { toast } from "sonner"

// import { cidrv4 } from "zod";
import { cn } from "@/lib/utils";

import Image from "next/image";

const { env: { imagekit: { publicKey, urlEndpoint }} } = config;

const authenticator = async () => {

  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/imagekit`);
    // const response = await fetch(`${config.env.prodApiEndpoint}/api/imagekit`);
    
    if (!response.ok) {
      const errorText = await response.text();
      
      throw new Error (
        `Request failed with status ${response.status}: ${errorText}`
      )
    }
    
    const data = response.json();

    const { signature, expire, token } = await data;

    return { signature, expire, token }
  } catch (error: any) {
    throw new Error(`Authentication request failed!: ${error.message}`);
  }
}

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {

  const ikUploadRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<{filePath: string | null}>({
    filePath: value ?? null
  })

  

  const [progress, setProgress] = useState(0);

  const styles = {
    button: variant === "dark" ? "bg-dark-300" : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400", 
  }

  const onError = (error: any) => {
    console.log(error);
    toast(
     `${type} upload failed. Your ${type} could not be uploaded. Please try again......`,
    )
  }

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast(
      `${type} uploaded successfully. ${res.filePath} uploaded successfully!`
    );
  }

  const onValidate = (file: File) => {
    if (type === "image") {
      if ( file.size > 1024 * 1024 ) {
        toast(
          "File size too large. Please upload a file that is less than 20MB in size",
        );

        return false;
      }

    } else if (type === "video") {
      if (file.size > 50 * 1024 * 1024) {
        toast(
          "File size too large. Please upload a file that is less than 50MB in size"
        );

        return false;
      }
    }
    return true
  };

  return (
    <IKContext 
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className="hidden"
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        validateFile={onValidate}
        onLoadStart={() => setProgress(0)}
        folder={folder}
        accept={accept}

        onUploadProgress={({loaded, total}: { loaded: number; total: number }) => { 
          const percentage = Math.round((loaded / total) * 100);
          setProgress(percentage);
        }}
        
      />

      <button
        className={cn("upload-btn", styles.button)}
        onClick={(e) => {
          e.preventDefault();

          if (ikUploadRef.current) {// if it has a value--------------------
            ikUploadRef.current?.click(); //This is use to simulates click on the hidden "<IKUpload/>"

            /*
            "ikUploadRef.current?.click()": This tries to click the element referenced by ikUploadRef.current. It programmatically
            triggers a click event on the referenced element — often used to open a file picker or simulate a button click.
            The button triggers the hidden file input. The user never sees the input(<IKUpload/>), but still gets the file upload dialog(ImageKit upload dialog).
            */ 
          }
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />

        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>
        {file && ( <p className={cn("upload-filename", styles.text)}>{file.filePath}</p> )}
      </button>
      {file.filePath && (
        <IKImage
        alt={file.filePath}
        path={file.filePath}
        width={500}
        height={300}
        />
      )
      }
    </IKContext>
  );
}

export default  FileUpload;