import { Dispatch, useDispatch, useSelector } from 'umi';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import {FilterOptions, Filters, GeneAction} from "@/pages/model";

import type {Option} from "react-bootstrap-typeahead/types/types";
import 'react-bootstrap-typeahead/css/Typeahead.css';


interface ChartProps{
  filterOptions: FilterOptions
  selectedFilters: FilterOptions
}

function getDispatchMethods(dispatch: Dispatch){
  return{
    onChange(selectedFilter:Filters, value: Option[]){
      console.log(selectedFilter, value);
      dispatch({
        type: `genes/${GeneAction.SET_SELECTED_FILTERS}`,
        selectedFilter: selectedFilter,
        value
      })
    },
  }
}



export default function ChartFilters(props:ChartProps){
  const { filterOptions, selectedFilters }= props;
  const { onChange } = getDispatchMethods(useDispatch());

  return(
    <div>
      <Form.Group>
        <Form.Label>Genes</Form.Label>
        <Typeahead
          id={Filters.GeneSymbols}
          labelKey="genes"
          multiple
          onChange={(selectedGeneSymbols)=> onChange(Filters.GeneSymbols, selectedGeneSymbols )}
          options={filterOptions[Filters.GeneSymbols] || []}
          disabled={!filterOptions[Filters.GeneSymbols]}
          placeholder="Select a list of genes"
          selected={selectedFilters[Filters.GeneSymbols]}
        />
      </Form.Group>
      <Form.Group style={{ marginTop: '20px' }}>
        <Form.Label>Diagnosis</Form.Label>
        <Typeahead
          clearButton
          id={Filters.DiagnosisList}
          labelKey="diagnosis"
          disabled={!filterOptions[Filters.DiagnosisList]}
          multiple
          onChange={(selectDiagnostics)=> onChange(Filters.DiagnosisList, selectDiagnostics)}
          options={filterOptions[Filters.DiagnosisList]|| []}
          placeholder="Select a list of genes"
          selected={selectedFilters[Filters.DiagnosisList]}
        />
      </Form.Group>
    </div>
  );
}
