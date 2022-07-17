import fetch from 'node-fetch';
import {Request,Response} from "express";
import {GeneExpression} from "@/api";


/**
 *  A helper method that converts text files (tsv format)
 *  to array of objects
 * @param textFile
 */
function convertTsvToJSON(textFile:string){

  // replacing if any values contains \r with empty space
  let allLines = textFile
    .replaceAll(/\r/g,'' )
    .split("\n");

  // considering the first row or line as headers and \r
  let headers = allLines[0].split("\t");

  // handling all other rows and columns
  const geneExpressions:GeneExpression[] = allLines
    .reduce((expressions:any[], value:string, index)=> {

      // first row  is headers with index 0, hence omitting
      if(index > 0 ){
        const geneExpression: GeneExpression = value.split("\t")
          .reduce((acc:any, columnValue, i)=>{
            // mapping the headers with column values
            acc[headers[i]] = columnValue;
            return acc;
        },{});

        expressions.push(geneExpression);
    }

    return expressions;
  },[]);

  return geneExpressions;
}


export default {
  "GET /genes": (request:Request,response:Response) =>{
    setTimeout(async () => {
      // fetching the data-set from the github raw url
      const res = await fetch('https://raw.githubusercontent.com/PDCMFinder/expression-data-test/main/Expression.tsv');

      const data = await res.text();
      const expressions:GeneExpression[] = convertTsvToJSON(data);

      response.json(expressions);
    }, 1000);
  }
}
