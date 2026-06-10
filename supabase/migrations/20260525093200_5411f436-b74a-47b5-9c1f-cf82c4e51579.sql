CREATE POLICY "Participants can delete conversations"
ON public.conversations
FOR DELETE
TO authenticated
USING ((auth.uid() = user_a) OR (auth.uid() = user_b));