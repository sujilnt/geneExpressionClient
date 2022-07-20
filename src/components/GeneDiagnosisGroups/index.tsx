import React, {memo, useMemo} from "react";
import type {GeneExpression} from "@/api";

import styles from "./style.less";

interface GeneDiagnosisGroupsProps{
  data: GeneExpression[],
  diagnosisList: string[]
}

interface GeneDiagnosisGroups{
  [modelId:string]: Set<number> // set of diagnosis
}

function calcWidth(num:number, total:number){
  const widthPercent = num ? (num/total) * 100 : 0;
  return {
    width: `${widthPercent}%`,
    display: widthPercent ? "block" : "none"
  }
}

function groupByModelIdAndDiagnosis(geneExpressions: GeneExpression[]):GeneDiagnosisGroups{
  return geneExpressions.reduce((acc, {diagnosis,modelId})=>{
    // @ts-ignore Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
    // No index signature with a parameter of type 'string' was found on type '{}'.
    const modelIdGroup = acc[diagnosis] || new Set();

    modelIdGroup.add(modelId);

    // @ts-ignore Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
    // No index signature with a parameter of type 'string' was found on type '{}'.
    acc[diagnosis] = modelIdGroup;
  return acc;
},{});
}


function GeneDiagnosisGroups({data, diagnosisList}: GeneDiagnosisGroupsProps){
  const measurements =  useMemo(()=> groupByModelIdAndDiagnosis(data),[data]);
  const diagnosisData = useMemo(()=> diagnosisList, [diagnosisList]);

  const totalMeasurements = Object.values(measurements).reduce((acc, value)=> acc + (value.size),0);
  return(
    <div className={styles.container}>
      {diagnosisData?.map((diagnosis) =>
        <div key={diagnosis} className={styles.item} style={calcWidth(measurements[diagnosis].size, totalMeasurements)}>
        {diagnosis}
      </div>)
      }
    </div>
  );
}

export default memo(GeneDiagnosisGroups);
