import os
import pandas as pd

def read_file(path, **kwargs):
    if kwargs:
        # Unpack the keyword arguments
        sheet_name, header = kwargs['sheet_name'], kwargs['header']

        # Read a given sheet in the excel file
        data = pd.read_excel(path, sheet_name=sheet_name, header=header)
    else:
        data = pd.read_excel(path)

    return data

def get_variable(data, col_name, var_name):
    if type(var_name) == list:
        l = len(var_name)
        if l == 0:
            print('No variable names provided. You gave var names:', var_name)
            raise ValueError
        else:
            for v in var_name:
                assert type(v) == str, f'variable {v} is not a string'
            data = data.loc[data[col_name].isin(var_name)]
    elif type(var_name) == str:
        data = data.loc[data[col_name] == var_name]
    
    return data

geo_codes = pd.read_csv('data/Westminster_Parliamentary_Constituencies_(Future)_Names_and_Codes_in_the_United_Kingdom_v2.csv', usecols=['PCON24CD', 'PCON24NM'])

if __name__ == "__main__":
    # Set params
    path = 'data/Demographic-data-for-new-parliamentary-constituencies-May-2024.xlsx'
    kwargs = {'sheet_name': 'EW_data', 'header': 2}

    # Read the file and cut the data 
    data = read_file(path, **kwargs).pipe(get_variable, 'Topic', 'Population')
    
    # Drop unused columns and rename to merge with constituency codes
    data.drop(columns=['Topic', 'England & Wales value'], inplace=True)
    data.rename(columns={'New constituency name': 'PCON24NM'}, inplace=True)

    # Merge the geo codes and data, and set the index to the geo code.
    data = data.merge(geo_codes, on='PCON24NM', how='inner').set_index('PCON24CD', drop=True)
    print(data.tail(3))