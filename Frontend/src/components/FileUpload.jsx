function FileUpload({ multiple = false, setFiles }) {
  return (
    <input
      type="file"
      multiple={multiple}
      onChange={(e) => setFiles([...e.target.files])}
    />
  );
}

export default FileUpload;