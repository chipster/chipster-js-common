import { Dataset, Job } from "..";
import MetadataFile from "../model/metadata-file";

export default class PhenodataUtils {
  static readonly PHENODATA_PREFIX = "phenodata";
  static readonly DEFAULT_PHENODATA_FILENAME = "phenodata.tsv";
  static readonly GROUP_COLOMN = "group";

  static hasOwnPhenodata(dataset: Dataset): boolean {
    return this.getOwnPhenodata(dataset) != null;
  }

  static getOwnPhenodata(dataset: Dataset): string {
    const phenodataFile = this.getOwnPhenodataFile(dataset);
    return phenodataFile != null ? phenodataFile.content : null;
  }

  static getOwnPhenodataFile(dataset: Dataset): MetadataFile {
    return dataset.metadataFiles != null
      ? dataset.metadataFiles.find(metadataFile =>
          metadataFile.name.startsWith(this.PHENODATA_PREFIX)
        )
      : null;
  }

  /**
   * If given dataset has its own phenodata, return that phenodata.
   * Otherwise search ancestors for a dataset which has phenodata and return phenodata
   * of that ancestor if found.
   *
   * @param dataset
   */
  static getPhenodata(
    dataset: Dataset,
    jobsMap: Map<string, Job>,
    datasetsMap: Map<string, Dataset>,
    phenodataTypeCheck: (Dataset) => boolean
  ): string {
    return this.getOwnPhenodata(
      this.getPhenodataDataset(
        dataset,
        jobsMap,
        datasetsMap,
        phenodataTypeCheck
      )
    );
  }

  /**
   * If given dataset has its own phenodata, return given dataset.
   * Otherwise search ancestors for a dataset which has phenodata and return that
   * ancestor if found.
   *
   * @param dataset
   */
  static getPhenodataDataset(
    dataset: Dataset,
    jobsMap: Map<string, Job>,
    datasetsMap: Map<string, Dataset>,
    phenodataTypeCheck: (Dataset) => boolean
  ): Dataset {
    if (dataset == null) {
      return null;
    }

    // if dataset has it own phenodata return that
    if (this.hasOwnPhenodata(dataset)) {
      return dataset;
    }

    // find first ancestor that has phenodata
    const ancestorsWithPhenodata = this.getAncestorDatasetsWithPhenodata(
      dataset,
      jobsMap,
      datasetsMap,
      phenodataTypeCheck
    );
    return ancestorsWithPhenodata.length > 0 ? ancestorsWithPhenodata[0] : null;
  }

  static getAncestorDatasetsWithPhenodata(
    dataset: Dataset,
    jobsMap: Map<string, Job>,
    datasetsMap: Map<string, Dataset>,
    phenodataTypeCheck: (Dataset) => boolean
  ) {
    if (!phenodataTypeCheck(dataset)) {
      return [];
    }
    return this.getAncestorsBottomUpBreadthFirstWithFilter(
      this.getParentDatasets(dataset, jobsMap, datasetsMap),
      (d: Dataset) => this.hasOwnPhenodata(d),
      jobsMap,
      datasetsMap
    );
  }

  private static getAncestorsBottomUpBreadthFirstWithFilter(
    datasets: Dataset[],
    filter: (Dataset) => boolean,
    jobsMap: Map<string, Job>,
    datasetsMap: Map<string, Dataset>
  ): Dataset[] {
    // stop if no datasets
    if (datasets.length < 1) {
      return [];
    }

    // add datasets with phenodata to results
    const datasetsWithPhenodata = datasets.filter(filter);

    // get parents of the datasets and process them next
    const allParents = datasets.reduce(
      (previousLevelParents: Dataset[], parent: Dataset) => {
        return previousLevelParents.concat(
          this.getParentDatasets(parent, jobsMap, datasetsMap)
        );
      },
      []
    );

    return datasetsWithPhenodata.concat(
      this.getAncestorsBottomUpBreadthFirstWithFilter(
        allParents,
        filter,
        jobsMap,
        datasetsMap
      )
    );
  }

  static getParentDatasets(
    dataset: Dataset,
    jobsMap: Map<string, Job>,
    datasetsMap: Map<string, Dataset>
  ): Dataset[] {
    // if source job exists and has inputs, return those that still exist on this session
    const sourceJob = jobsMap.get(dataset.sourceJob);
    return sourceJob != null ||
      sourceJob.inputs != null ||
      sourceJob.inputs.length > 1
      ? sourceJob.inputs
          .map(jobInput => datasetsMap.get(jobInput.datasetId))
          .filter(parentDataset => parentDataset != null)
      : [];
  }
}