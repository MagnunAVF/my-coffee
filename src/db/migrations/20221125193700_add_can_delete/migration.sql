-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "canDelete" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "canDelete" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "canDelete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "canDelete" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "canDelete" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Shipping" ADD COLUMN     "canDelete" BOOLEAN NOT NULL DEFAULT true;
