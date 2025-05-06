"use client";
import type { Category } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { HexColorPicker } from 'react-colorful'; // Simple color picker
import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name must be 50 characters or less"),
  color: z.string().optional(), // HEX color string
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category; // For editing
  onSubmit: (data: CategoryFormData) => void;
  onCancel?: () => void;
  submitButtonText?: string;
}

const defaultColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(240 60% 60%)", // A nice blue
  "hsl(150 60% 50%)", // A pleasant green
  "hsl(30 90% 60%)",  // A warm orange
];


export default function CategoryForm({ category, onSubmit, onCancel, submitButtonText = "Save Category" }: CategoryFormProps) {
  const [selectedColor, setSelectedColor] = useState(category?.color || defaultColors[0]);
  
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      color: category?.color || defaultColors[0],
    },
  });

  useEffect(() => {
    // Update form if selectedColor changes externally or on initial load with category
    form.setValue('color', selectedColor);
  }, [selectedColor, form, category]);


  const handleSubmit = (data: CategoryFormData) => {
    onSubmit({ ...data, color: selectedColor });
     if (!category) { // Reset form only if it's for adding new category
      form.reset({ name: '', color: defaultColors[0] });
      setSelectedColor(defaultColors[0]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Personal Errands" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Color</FormLabel>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" type="button" className="w-full justify-start text-left font-normal">
                      <div className="w-5 h-5 rounded-sm mr-2 border" style={{ backgroundColor: selectedColor }} />
                      {selectedColor ? <span>{selectedColor}</span> : <span>Pick a color</span>}
                       <Palette className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-0 shadow-none">
                     <div className="p-4 bg-card rounded-md shadow-lg border">
                        <HexColorPicker color={selectedColor} onChange={(newColor) => {
                            setSelectedColor(newColor);
                            field.onChange(newColor); // Update form value as well
                        }} />
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {defaultColors.map((colorOption) => (
                            <Button
                                key={colorOption}
                                type="button"
                                variant="outline"
                                className="p-0 h-8 w-8"
                                onClick={() => {
                                    setSelectedColor(colorOption);
                                    field.onChange(colorOption);
                                }}
                            >
                                <div className="w-full h-full rounded-sm" style={{ backgroundColor: colorOption }} />
                            </Button>
                            ))}
                        </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
          <Button type="submit">{submitButtonText}</Button>
        </div>
      </form>
    </Form>
  );
}
