import { uniqWith } from "lodash-es";
import type Dataset from "../model/dataset.js";
import type Job from "../model/job.js";
import MetadataFile from "../model/metadata-file.js";

export default class PhenodataUtils {
  static readonly PHENODATA_PREFIX = "phenodata";
  static readonly DEFAULT_PHENODATA_FILENAME = "phenodata.tsv";
  static readonly GROUP_COLOMN = "group";

  static hasOwnPhenodata(dataset: Dataset): boolean {
    return this.getOwnPhenodata(dataset) != null;
  }

  static getOwnPhenodata(dataset: Dataset | null): string | null {
    const phenodataFile = this.getOwnPhenodataFile(dataset);
    return phenodataFile != null ? phenodataFile.content : null;
  }

  static getOwnPhenodataFile(
    dataset: Dataset | null
  ): MetadataFile | null | undefined {
    return dataset != null && dataset.metadataFiles != null
      ? dataset.metadataFiles.find((metadataFile) =>
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
    phenodataTypeCheck: (dataset: Dataset) => boolean
  ): string | null {
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
    phenodataTypeCheck: (dataset: Dataset) => boolean
  ): Dataset | null {
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
    phenodataTypeCheck: (dataset: Dataset) => boolean
  ) {
    if (!phenodataTypeCheck(dataset)) {
      return [];
    }
    return this.getAncestorsBottomUpBreadthFirstWithFilter(
      [dataset],
      (d: Dataset) => this.hasOwnPhenodata(d),
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
    filter: (dataset: Dataset) => boolean,
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
        let newParents = this.getParentDatasets(dataset, jobsMap, datasetsMap);
        return parents.concat(newParents);
      },
      []
    );

    // remove duplicate datasets when there were multiple routes to the same (grand)parent
    let uniqueParents = uniqWith(
      allParents,
      (d1: Dataset, d2: Dataset) => d1.datasetId === d2.datasetId
    );

    //console.log("parents", uniqueParents);

    // add parents which pass the filter to results
    const filteredAncestors = uniqueParents.filter(filter);

    //console.log("filtered parents", filteredAncestors);

    let grandParents = this.getAncestorsBottomUpBreadthFirstWithFilter(
      uniqueParents,
      filter,
      jobsMap,
      datasetsMap
    );

    //console.log("grand parents", grandParents);

    let uniqueAncestors = uniqWith(
      filteredAncestors.concat(grandParents),
      (d1: Dataset, d2: Dataset) => d1.datasetId === d2.datasetId
    );

    //console.log("unique parents", uniqueAncestors);

    return uniqueAncestors;
  }

  static getParentDatasets(
    dataset: Dataset,
    jobsMap: Map<string, Job>,
    datasetsMap: Map<string, Dataset>
  ): Dataset[] {
    // if source job exists and has inputs, return those that still exist on this session
    const sourceJob = jobsMap.get(dataset.sourceJob);

    if (
      sourceJob != null &&
      sourceJob.inputs != null &&
      sourceJob.inputs.length > 0
    ) {
      return sourceJob.inputs
        .map((jobInput) => datasetsMap.get(jobInput.datasetId))
        .filter((parentDataset) => parentDataset != null) as Dataset[];
    } else {
      return [];
    }
  }
}
