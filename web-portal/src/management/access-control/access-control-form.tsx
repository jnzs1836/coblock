import { FormContainer, FormControlContainer, Label, ButtonContainer } from './styles';
import SelectContainer from './select-container';
import AccessList from './access-list';
import { useBlueprintAccessListAPI } from './hooks';
import { BlueprintAccess, MinecraftBlueprint } from '../../types/minecraft';
import AccessUserSearchPanel from './access-user-search-panel';


interface Props {
    blueprint: MinecraftBlueprint
}

const AccessControlForm = ({blueprint}: Props) => {
    const {
        data: accessList, onUpdateAccessListRaw, onDelete, onAddNewAccess
    } = useBlueprintAccessListAPI(blueprint);

  return (
    <FormContainer>
      <FormControlContainer>
        
          {/* select input for username */}
        <AccessList
            blueprint={blueprint}
            accessList={accessList}
            onDelete={(access) => {
                onDelete(access);
            }}
            onUpdate={(id: string) => {
                // onDelete(id);
            }}
        />    
      </FormControlContainer>
      <AccessUserSearchPanel
        blueprint={blueprint}
        onUpdateAccessListRaw={onUpdateAccessListRaw}
        onAddNewAccess={onAddNewAccess}
      />
      {/* more form controls */}
      <ButtonContainer>
        {/* buttons for adding and cancelling */}
      </ButtonContainer>
    </FormContainer>
  );
};

export default AccessControlForm;
