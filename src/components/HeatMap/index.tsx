import {memo} from "react";
import { ResponsiveHeatMapCanvas } from '@nivo/heatmap';
import GeneDiagnosisGroups from "@/components/GeneDiagnosisGroups";

import type {ContinuousColorScaleConfig} from "@nivo/colors";
import type {AnchoredContinuousColorsLegendProps} from "@nivo/legends";
import type {GeneExpression} from "@/api";
import type {CanvasAxisProps} from "@nivo/axes";

interface ChartOptions{
  margin: object;
  axisTop: CanvasAxisProps<string> | null;
  axisRight: CanvasAxisProps<string>| null;
  axisLeft: CanvasAxisProps<string>| null;
  colors: ContinuousColorScaleConfig;
  legends: Omit<AnchoredContinuousColorsLegendProps, 'scale' | 'containerWidth' | 'containerHeight'>[];
}

interface HeatMapChartProps{
  data: GeneExpression[];
  diagnosisList?: string[]
}

const chartConfig: ChartOptions= {
  margin:{ top: 50, right: 115, left: 90, bottom: 50 },
  axisTop: {
    tickSize: 8,
    tickPadding: 5,
    tickRotation: 0,
    legendOffset: 28
  },
  axisRight:{
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: 'genes',
    legendPosition: 'middle',
    legendOffset: 70
  },
  axisLeft:{
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: 'genes',
    legendPosition: 'middle',
    legendOffset: -72
  },
  legends:[
    {
      anchor: 'top-right',
      translateX: 90,
      translateY: -12,
      length: 427,
      thickness: 11,
      direction: 'column',
      tickPosition: 'after',
      tickSize: 3,
      tickSpacing: 4,
      tickOverlap: false,
      tickFormat: '^ .3g',
      title: 'Value ( zscores ) → ',
      titleAlign: 'middle',
      titleOffset: 4
    }
  ],
  colors: {
    type: 'quantize',
    scheme: 'red_yellow_blue',
    minValue: -100000,
    maxValue: 100000,
    steps: 7
  }
}
const getData = (data: GeneExpression[])=>{
  return data.reduce((acc:any, geneExpression:GeneExpression)=>{
    const expression = acc.find(({id}:{id:string})=>acc.id=== geneExpression.geneSymbol);

    if(!expression?.id){
      acc.push({
        id: geneExpression.geneSymbol,
        data: [{
          x: geneExpression.modelId,
          y: geneExpression.zScore,
          diagnosis: geneExpression.diagnosis
        }]
      });
    } else{
      expression.data.push({
        x: geneExpression.modelId,
        y: geneExpression.zScore,
        diagnosis: geneExpression.diagnosis
      });
    }

    return acc;
  },[]);
};


function HeatMapChart({data, diagnosisList}:HeatMapChartProps){
  const chartData = getData(data);

return(
  <>
    { chartData?.length && diagnosisList?.length
       ? <GeneDiagnosisGroups data={data}  diagnosisList={diagnosisList} />
       : null
    }
    <ResponsiveHeatMapCanvas
      data={chartData}
      margin={chartConfig.margin}
      valueFormat=" ^ .3g"
      axisTop={chartConfig.axisTop}
      axisRight={chartConfig.axisRight}
      axisLeft={chartConfig.axisLeft}
      colors={chartConfig.colors}
      emptyColor="#555555"
      legends={chartConfig.legends}
      hoverTarget="cell"
    />
  </>
  );
}

export default memo(HeatMapChart)
