"use client";

import * as z from "zod";
import axios from "axios";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";



import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";


import { formSchema } from "./constants";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import abi from "../../../abi.json";
const BorrowPage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(
      "first",
      BigInt(100000000000000000 * parseInt(values.prompt)),
      values.prompt
    );
    const config = await prepareWriteContract({
      address: "0x9111F9AE8240E57d9b2Cb24AD15AcCbA56390E28",
      abi: abi,
      functionName: "borrow",
      args: [BigInt(1000000000000000000 * parseFloat(values.prompt))],
    });

    const { hash } = await writeContract(config);
    console.log("hash", hash);
  };

  return (
    <div>
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={false}
                        placeholder="Amount in Wei"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                type="submit"
                disabled={false}
                size="icon"
              >
                Borrow
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BorrowPage;
