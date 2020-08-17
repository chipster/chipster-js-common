import { Dataset, Job } from "..";
import MetadataFile from "../model/metadata-file";
import * as _ from "lodash";

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
      [dataset],
      () => true,
      jobsMap,
      datasetsMap
    );
  }

  /**
   * TODO Recursive and that _.uniqWith maybe not good.
   *
   * @param sessionData
   * @param datasets
   * @param filter
   */
  static getAncestorsBottomUpBreadthFirstWithFilter(
    datasets: Dataset[],
    filter: (Dataset) => boolean,
    jobsMap: Map<string, Job>,
    datasetsMap: Map<string, Dataset>
  ): Dataset[] {
    // stop if no datasets
    if (datasets.length < 1) {      
      return [];
    }
    // get all parents
    const allParents = datasets.reduce(
      (parents: Dataset[], dataset: Dataset) => {
        let newParents = this.getParentDatasets(dataset, jobsMap, datasetsMap)
        return parents.concat(newParents);
      },
      []
    );

    // add parents which pass the filter to results
    const filteredAncestors = allParents.filter(filter);

    let grandParents = this.getAncestorsBottomUpBreadthFirstWithFilter(
      allParents,
      filter,
      jobsMap,
      datasetsMap);

    let uniqueAncestors = _.uniqWith(
      filteredAncestors.concat(grandParents),
      (d1: Dataset, d2: Dataset) => d1.datasetId === d2.datasetId
    );

    return uniqueAncestors;
  }

  static getParentDatasets(
    dataset: Dataset,
    jobsMap: Map<string, Job>,
    datasetsMap: Map<string, Dataset>
  ): Dataset[] {
    // if source job exists and has inputs, return those that still exist on this session
    const sourceJob = jobsMap.get(dataset.sourceJob);    

    if (sourceJob != null &&
      sourceJob.inputs != null &&
      sourceJob.inputs.length > 0) {

      return sourceJob.inputs
        .map(jobInput => datasetsMap.get(jobInput.datasetId))
        .filter(parentDataset => parentDataset != null);
    } else {
      return [];
    }
  }
}
