import { ResponsiveHeatMap } from '@nivo/heatmap';
import {useCallback} from "react";
import {GeneExpression} from "@/api";
import {Filters} from "@/pages/model";
import {AxisProps} from "@nivo/axes";
import {ContinuousColorScaleConfig} from "@nivo/colors";
import {HeatMapCommonProps, HeatMapDatum} from "@nivo/heatmap/dist/types/types";
import {Datum} from "@nivo/legends";
import styles from "./style.less";


interface ChartOptions extends HeatMapCommonProps<any>{
  axisTop: AxisProps| null,
  axisRight: AxisProps| null,
  axisLeft: AxisProps| null,
  colors: ContinuousColorScaleConfig,
}

const chartConfig: ChartOptions= {
  margin:{ top: 50, right: 90, left: 90, bottom: 50 },
  axisTop: {
    tickSize: 8,
    tickPadding: 5,
    tickRotation: 0,
    legend: 'model id',
    legendPosition: 'middle',
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
      translateX: 75,
      translateY: -12,
      length: 427,
      thickness: 11,
      direction: 'column',
      tickPosition: 'after',
      tickSize: 3,
      tickSpacing: 4,
      tickOverlap: false,
      tickFormat: '>-.2s',
      title: 'Value →',
      titleAlign: 'start',
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
export default function HeatMapChart(props){
  const {selectedFilters, data} = props;
  const getData = useCallback((data: GeneExpression[])=>{
    return data.reduce((acc:any, geneExpression:GeneExpression)=>{
       const expression = acc.find((acc)=>acc.id=== geneExpression.geneSymbol);

       if(!expression?.id){
         acc.push({
           id: geneExpression.geneSymbol,
           data: [{
             x: geneExpression.modelId,
             y: geneExpression.zScore,
           }]
         });
       } else{
         expression.data.push({
           x: geneExpression.modelId,
           y: geneExpression.zScore,
         });
       }

       return acc;
     },[]);
  }, [selectedFilters[Filters.GeneSymbols], selectedFilters[Filters.DiagnosisList]]);

return(
  <ResponsiveHeatMap
    className={styles.heatmap}
    data={data?.length ? getData(data): []}
    margin={chartConfig.margin}
    valueFormat=" ^ .3g"
    axisTop={chartConfig.axisTop}
    axisRight={chartConfig.axisRight}
    axisLeft={chartConfig.axisLeft}
    colors={chartConfig.colors}
    emptyColor="#555555"
    legends={chartConfig.legends}
  />
)
}
