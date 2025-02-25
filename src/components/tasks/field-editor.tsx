import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus } from 'lucide-react';
import { useAtom } from 'jotai';
import { customFieldsAtom } from '@/atoms/table';
import { CustomFieldType } from '@/atoms/table';
import { Switch } from '@/components/ui/switch';

export default function CustomFieldEditor() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<CustomFieldType>(
    CustomFieldType.Text
  );
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [defaultValue, setDefaultValue] = useState<string | number>('');
  const [defaultChecked, setDefaultChecked] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const [customFields, setCustomFields] = useAtom(customFieldsAtom);

  const handleAddField = () => {
    if (!fieldName || !fieldType) {
      return;
    }

    const newField = {
      id: Date.now().toString(),
      name: fieldName,
      type: fieldType,
      description,
      defaultValue:
        fieldType === CustomFieldType.Checkbox ? defaultChecked : defaultValue,
    };

    setCustomFields((prev) => [...prev, newField]);
    clearFields();
    setIsModalOpen(false);
  };

  const handleCancelFlow = () => {
    setIsModalOpen(false);
    clearFields();
  };

  const clearFields = () => {
    setFieldName('');
    setFieldType(CustomFieldType.Text);
    setDescription('');
    setShowDescription(false);
    setDefaultValue('');
    setDefaultChecked(false);
  };

  const handleRemoveFields = () => {
    setCustomFields((prev) =>
      prev.filter((field) => !selectedFields.includes(field.id))
    );
    setSelectedFields([]);
    setIsModalOpen(false);
  };

  const handleToggleSelection = (id: string) => {
    setSelectedFields((prev) =>
      prev.includes(id)
        ? prev.filter((fieldId) => fieldId !== id)
        : [...prev, id]
    );
  };

  const footer = () => {
    return (
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={handleCancelFlow}>
          Cancel
        </Button>
        <Button
          onClick={handleRemoveFields}
          disabled={selectedFields.length === 0}
          className="bg-black text-white"
        >
          Remove
        </Button>
      </div>
    );
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-black text-white"
      >
        Edit Fields
      </Button>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/75 z-[101]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">Edit Custom Fields</h2>
            <Tabs defaultValue="add" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="add">Add Field</TabsTrigger>
                <TabsTrigger value="remove">Remove Field</TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-3" value="add">
                <div className="flex gap-4 mb-3">
                  <div className="w-2/3">
                    <label className="block text-sm font-medium mb-1">
                      Field Name*
                    </label>
                    <Input
                      value={fieldName}
                      onChange={(e) => setFieldName(e.target.value)}
                      placeholder="Enter field name"
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm font-medium mb-1">
                      Field Type*
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setFieldType(value as CustomFieldType)
                      }
                      value={fieldType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="z-[102]">
                        {Object.values(CustomFieldType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setShowDescription(!showDescription)}
                    >
                      {showDescription ? (
                        <Minus size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                    </button>
                    <label className="text-sm font-medium">
                      Add Description(Optional)
                    </label>
                  </div>
                  {showDescription && (
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description"
                      className="mb-3"
                    />
                  )}
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    Default Value(Optional)
                  </label>
                  {fieldType === CustomFieldType.Checkbox ? (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={defaultChecked}
                        onCheckedChange={setDefaultChecked}
                        className="w-8 h-5"
                      />
                      <span>{defaultChecked ? 'Checked' : 'Unchecked'}</span>
                    </div>
                  ) : (
                    <Input
                      value={defaultValue}
                      onChange={(e) => setDefaultValue(e.target.value)}
                      placeholder="Enter default value"
                    />
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={handleCancelFlow}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddField}
                    className="bg-black text-white"
                  >
                    Create
                  </Button>
                </div>
              </TabsContent>
              <TabsContent className="flex flex-col gap-3" value="remove">
                {customFields.length > 0 ? (
                  <>
                    <div className="border rounded-md p-3 flex flex-col">
                      {customFields.map((field) => (
                        <label
                          key={field.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                        >
                          <Input
                            type="checkbox"
                            checked={selectedFields.includes(field.id)}
                            onChange={() => handleToggleSelection(field.id)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{field.name}</span>
                        </label>
                      ))}
                    </div>
                    {footer()}
                  </>
                ) : (
                  <>
                    <p className="text-center text-gray-500">
                      No custom fields found.
                    </p>
                    {footer()}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
}
