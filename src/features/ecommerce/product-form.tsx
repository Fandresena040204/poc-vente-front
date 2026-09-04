import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { type Product, statusLabels } from '@/features/tables/data'

const categories = [
  'Accessories',
  'Audio',
  'Displays',
  'Office',
  'Peripherals',
  'Storage',
]

type ProductFormProps = {
  mode: 'create' | 'edit'
  initialProduct?: Product
}

export function ProductForm({ mode, initialProduct }: ProductFormProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    toast.success(
      mode === 'create' ? 'Product created' : 'Product updated'
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className='grid gap-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-2 sm:col-span-2'>
            <Label htmlFor='product-name'>Product name</Label>
            <Input
              id='product-name'
              defaultValue={initialProduct?.name}
              placeholder='Wireless Mouse'
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='product-category'>Category</Label>
            <Select defaultValue={initialProduct?.category ?? categories[0]}>
              <SelectTrigger id='product-category' className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='product-status'>Status</Label>
            <Select defaultValue={initialProduct?.status ?? 'in-stock'}>
              <SelectTrigger id='product-status' className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='product-price'>Price</Label>
            <Input
              id='product-price'
              type='number'
              step='0.01'
              min='0'
              defaultValue={initialProduct?.price}
              placeholder='29.99'
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='product-stock'>Stock</Label>
            <Input
              id='product-stock'
              type='number'
              min='0'
              defaultValue={initialProduct?.stock}
              placeholder='100'
              required
            />
          </div>

          <div className='flex flex-col gap-2 sm:col-span-2'>
            <Label htmlFor='product-description'>Description</Label>
            <Textarea
              id='product-description'
              rows={4}
              placeholder='Short description of the product...'
            />
          </div>
        </CardContent>
        <CardFooter className='justify-end gap-2'>
          <Button type='button' variant='outline'>
            Cancel
          </Button>
          <Button type='submit'>
            {mode === 'create' ? 'Create product' : 'Save changes'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
