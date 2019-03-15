import MetadataFile from "./metadata-file";

export default class Dataset {
  constructor(name: string) {
    this.name = name;
  }

  checksum: string;
  created: string;
  datasetId: string;
  sessionId: string;
  fileId: string;
  typeTags: { [key: string]: string };
  name: string;
  notes: string;
  metadataFiles: MetadataFile[];
  size: number;
  sourceJob: string;
  x: number;
  y: number;
}
