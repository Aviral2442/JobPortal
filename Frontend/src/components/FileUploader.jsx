import { useCallback, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import Dropzone from "react-dropzone";
import { TbCloudUpload, TbX } from "react-icons/tb";
import FileExtensionWithPreview from "@/components/FileExtensionWithPreview";
import { useNotificationContext } from "@/context/useNotificationContext";
import { formatBytes } from "@/helpers/file";
import clsx from "clsx";

const isFileWithPreview = (file) =>
  file && (typeof file.preview === "string" || typeof file === "string");

const FileUploader = ({
  files,
  setFiles,
  existingFiles = [],
  setExistingFiles,
  onUpload,
  accept,
  maxSize = 1024 * 1024 * 10,
  maxFileCount = 5,
  multiple = true,
  disabled = false,
  className,
  ...dropzoneProps
}) => {
  const { showNotification } = useNotificationContext();

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
        showNotification({
          message: "Cannot upload more than 1 file at a time",
          variant: "danger",
        });
        return;
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
        showNotification({
          message: `Cannot upload more than ${maxFileCount} files`,
          variant: "danger",
        });
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;
      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          showNotification({
            message: `File ${file.name} was rejected`,
            variant: "danger",
          });
        });
      }

      if (onUpload && updatedFiles.length > 0) {
        const target =
          updatedFiles.length > 1 ? `${updatedFiles.length} files` : `file`;

        onUpload(updatedFiles)
          .then(() => {
            showNotification({
              message: `${target} uploaded`,
              variant: "success",
            });
            setFiles([]);
          })
          .catch(() => {
            showNotification({
              message: `Failed to upload ${target}`,
              variant: "danger",
            });
          });
      }
    },
    [files, maxFileCount, multiple, onUpload, setFiles, showNotification]
  );

  const removeNewFile = (index) => {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const removeExistingFile = (index) => {
    if (!existingFiles || !setExistingFiles) return;
    const newExisting = existingFiles.filter((_, i) => i !== index);
    setExistingFiles(newExisting);
  };

  useEffect(() => {
    return () => {
      files?.forEach((file) => {
        if (isFileWithPreview(file) && file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount;

  return (
    <div>
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFileCount}
        multiple={maxFileCount > 1 || multiple}
        disabled={isDisabled}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            className={clsx("dropzone", className)}
            {...getRootProps()}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            <div className="dz-message needsclick text-center">
              <div className="avatar-lg mx-auto mb-3">
                <span className="avatar-title bg-info-subtle text-info rounded-circle">
                  <TbCloudUpload className="fs-24" />
                </span>
              </div>
              <h4 className="mb-2">Drop files here or click to upload</h4>
              <p className="text-muted fst-italic mb-3">
                Supports PDF Only.
              </p>
              <button type="button" className="btn btn-sm shadow btn-default">
                Browse Files
              </button>
            </div>
          </div>
        )}
      </Dropzone>

      {/* Existing Files */}
      {existingFiles?.map((file, index) => (
        <FileCard
          key={`existing-${index}`}
          file={file}
          onRemove={() => removeExistingFile(index)}
        />
      ))}

      {/* New Files */}
      {files?.map((file, index) => (
        <FileCard key={`new-${index}`} file={file} onRemove={() => removeNewFile(index)} />
      ))}
    </div>
  );
};

const FileCard = ({ file, onRemove }) => (
  <div className="dropzone-previews mt-3">
    <Card className="mt-1 mb-0 border-dashed border">
      <div className="p-2">
        <Row className="align-items-center">
          <Col xs="auto">
            {isFileWithPreview(file) && <FilePreview file={file} />}
          </Col>
          <Col className="ps-0">
            <span className="fw-semibold">{file.name || file.split?.(".").pop()}</span>
            {file.size && <p className="mb-0 text-muted">{formatBytes(file.size)}</p>}
          </Col>
          <Col xs="auto">
            <Button variant="link" size="sm" className="text-danger" onClick={onRemove}>
              <TbX />
            </Button>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
);

const FilePreview = ({ file }) => {
  const preview = file.preview || file; // file could be string from backend
  const type = file.type || "";

  if (type.startsWith("image/") || (typeof preview === "string" && preview.match(/\.(jpeg|jpg|png|gif|webp)$/i))) {
    return <img src={preview} alt={file.name || "file"} width={32} height={32} loading="lazy" className="avatar-sm rounded bg-light" />;
  }

  if (type === "application/pdf" || (typeof preview === "string" && preview.endsWith(".pdf"))) {
    return <embed src={preview} type="application/pdf" width={32} height={32} className="rounded bg-light" />;
  }

  return <FileExtensionWithPreview extension={file.name?.split(".").pop() || "file"} />;
};

export default FileUploader;
