"use client";

import { useState } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { communityApi } from "@/lib/api/community";
import { toast } from "sonner";
import { selectFieldClass } from "@/features/properties/property-form-styles";

export function CreatePostDialog({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} = {}) {
  const { t } = useI18n();
  const [localOpen, setLocalOpen] = useState(false);
  const queryClient = useQueryClient();

  const open = controlledOpen !== undefined ? controlledOpen : localOpen;
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setLocalOpen;

  const postSchema = z.object({
    title: z.string().min(5, t("validation.minLength", { min: 5 })),
    content: z.string().min(10, t("validation.minLength", { min: 10 })),
    type: z.enum(["Rental", "Discussion", "Finding"]),
    price: z.number().positive().optional(),
    address: z.string().optional(),
  });

  type PostFormValues = z.infer<typeof postSchema>;

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "Discussion",
      price: undefined,
      address: "",
    },
  });

  const watchType = form.watch("type");

  const mutation = useMutation({
    mutationFn: (data: any) => communityApi.createPost(data),
    onSuccess: () => {
      toast.success(t("community.save") + " ✓");
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể đăng bài");
    },
  });

  const onSubmit = (data: PostFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger || (
            <Button className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">
              <Plus className="mr-2 h-4 w-4" />
              {t("community.addPost")}
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-[550px] bg-white border-gray-200 text-gray-900">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900">{t("community.createTitle")}</DialogTitle>
            <DialogDescription className="text-gray-500">
              {t("community.createDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                {t("community.postTitle")}
              </label>
              <Input
                {...form.register("title")}
                placeholder="VD: Cần thuê phòng trọ quận 1..."
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
              />
              {form.formState.errors.title && (
                <span className="text-xs text-rose-500">{form.formState.errors.title.message}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("community.postType")}
                </label>
                <select
                  className="h-9 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  {...form.register("type")}
                >
                  <option value="Discussion">{t("community.typeDiscussion")}</option>
                  <option value="Rental">{t("community.typeRental")}</option>
                  <option value="Finding">{t("community.typeFinding")}</option>
                </select>
              </div>

              {watchType === "Rental" && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("community.price")}
                  </label>
                  <Input
                    type="number"
                    {...form.register("price", {
                      setValueAs: (v: string) => (v === "" || v === undefined) ? undefined : Number(v),
                    })}
                    placeholder="3.500.000"
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              )}
            </div>

            {watchType === "Rental" && (
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("community.address")}
                </label>
                <Input
                  {...form.register("address")}
                  placeholder="Địa chỉ chi tiết..."
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            )}

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                {t("community.postContent")}
              </label>
              <Textarea
                {...form.register("content")}
                placeholder="Nhập nội dung chia sẻ của bạn tại đây..."
                className="min-h-[120px] bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
              />
              {form.formState.errors.content && (
                <span className="text-xs text-rose-500">{form.formState.errors.content.message}</span>
              )}
            </div>
          </div>

          <DialogFooter className="bg-gray-50 border-gray-200">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t("community.save")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
